// TODO:
// 1) Clean up code.
// 2) Make all variables invisible

/**************************************************
** GAME VARIABLES
**************************************************/
var canvas,         // Canvas DOM element
    ctx,            // Canvas rendering context
    keys,           // Keyboard input
    localPlayer,    // Local player
    remotePlayer,  // Remote players
    socket,         // Player socket
    gameState,
    showMessage = true,
    gameStates,
    gameConstants,
    gameStrings,
    screenMessage,
    countdownID,
    ball,
    ballRadius = 10,
    isHost = false,
    playerScores = [0, 0];


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");
    gameStates = GameStates();
    gameConstants = GameConstants();
    gameStrings = GameStrings();

    gameState = gameStates.WAITING_FOR_OTHER_PLAYER;
    screenMessage = gameStrings.WAITING_FOR_PLAYER;

    try{
        socket = io('http://localhost:8000/',{ transports: ["websocket"] });
    } catch(e) {
        screenMessage = gameStrings.UNABLE_TO_CONNECT;
        return;
    }

    setEventHandlers();
    console.log(socket);
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
    window.addEventListener("keydown", onKeydown, false);
    window.addEventListener("keyup", onKeyup, false);

    //window.addEventListener("resize", onResize, true);

    socket.on("connect", onSocketConnected);
    socket.on("disconnect", onSocketDisconnect);
    socket.on("new player", onNewPlayer);
    socket.on("move player", onMovePlayer);
    socket.on("move ball", onMoveBall);
    socket.on("remove player", onRemovePlayer);
    socket.on("added to room", onAddedToRoom);
    socket.on("start game", onStartGame);
    // Game state change events
    socket.on("player score", onPlayerScore);
    socket.on("game over", onGameOver);
    socket.on("begin round", onBeginRound);
};

function onKeydown(e) {
    if (localPlayer) {
        keys.onKeyDown(e);
    }
}

function onKeyup(e) {
    if (localPlayer) {
        keys.onKeyUp(e);
    };
}

function onGameOver() {
    return false;
}

function onBeginRound() {
    return false;
}

function onResize(e) {
    canvas.width = ARENA_WIDTH;
    canvas.height = ARENA_HEIGHT;
}

function onSocketConnected() {
    console.log("Connected to socket server");
}

function onSocketDisconnect() {
    console.log("Disconnected from socket server");
}

function onAddedToRoom(data) {
    var playerX, playerY;

    isHost = data.isHost;
    playerX = isHost ? gameConstants.STARTING_X_LEFT : gameConstants.STARTING_X_RIGHT;
    playerY = gameConstants.STARTING_Y;
    localPlayer = new Paddle(new Vector([playerX, playerY]), isHost);

    socket.emit("new player", {
        x: localPlayer.getPos().x,
        y: localPlayer.getPos().y,
        isHost: isHost
    });

    keys = new Keys();
    gameLoop();
}

function onNewPlayer(data) {
    console.log("New player connected: " + data.id);
    var newPlayer = new Paddle(new Vector([data.x, data.y]), data.isHost);
    newPlayer.id = data.id;
    remotePlayer = newPlayer;
}

function onMovePlayer(data) {
    var playerToMove = playerById(data.id);

    if (!playerToMove) {
        return console.log("Player not found: " + data.id);
    }

    playerToMove.setPos(new Vector([data.x, data.y]));
}

function onStartGame() {
    screenMessage = gameStrings.STARTING_GAME;
    gameState = gameStates.STARTING_GAME;
    startCountdown(startGame);
}

function onPlayerScore(data) {
    playerScores = data.eventData.scores;
}

function onMoveBall(data) {
    ball.setPos(new Vector([data.x, data.y]));
}

function onRemovePlayer(data) {
    var playerToRemove = playerById(data.id);

    if (!playerToRemove) {
        return console.log("Player not found: " + data.id);
    }

    if(playerToRemove === remotePlayer) {
        remotePlayer = null;
    }
}

function startGame() {
    console.log("Game is starting");
    screenMessage = gameStrings.STARTING_GAME;
    resetScores();
    startRound();
}

function resetScores() {
    playerScores = [0,0];
}

function startRound() {
    var randomAngle = Math.random()*2*Math.PI - Math.PI;
        ballVelocity = new Vector([Math.cos(randomAngle), Math.sin(randomAngle)]),
        ballPos = new Vector([gameConstants.ARENA_WIDTH / 2,
                              gameConstants.ARENA_HEIGHT / 2]);
    if(ball) {
        ball.setPos(ballPos);
        ball.setVel(ballVelocity);
    } else {
        ball = new Ball(ballPos, ballVelocity, ballRadius);
    }

    gameState = gameStates.ACTIVE_ROUND;
    showMessage = false;
}

function startCountdown(callback) {
    var counter = 4;
    function countdown() {
        counter--;
        screenMessage = counter;
        if(counter === 0) {
            clearCountdown();
            callback();
        }
    }
    countdownID = window.setInterval(countdown, 1000);
}

function clearCountdown() {
    console.log("Cleared countdown");
    window.clearInterval(countdownID);
}

/**************************************************
** GAME ANIMATION LOOP
**************************************************/
function gameLoop() {
    update();
    if(gameState === gameStates.ACTIVE_ROUND && isHost){
        handleCollisions();
    }
    draw();
    // Request a new animation frame using Paul Irish's shim
    window.requestAnimFrame(gameLoop);
}


/**************************************************
** GAME UPDATE
**************************************************/
function update() {
    if (localPlayer.update(keys)) {
        socket.emit("move player", {
            x: localPlayer.getPos().x,
            y: localPlayer.getPos().y}
        );
    };
    if(isHost && gameState === gameStates.ACTIVE_ROUND && ball) {
        ball.update();
        socket.emit("move ball", {
            x: ball.getPos().x,
            y: ball.getPos().y
        });
    }
}

function playerById(id) {
    if(id === remotePlayer.id) {
        return remotePlayer;
    } else if(id === localPlayer.id) {
        return localPlayer;
    } else {
        return false;
    }
}

/**************************************************
** GAME DRAW
**************************************************/
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if(showMessage) {
        displayMessage();
    }

    if(gameState === gameStates.ACTIVE_ROUND && ball) {
        ball.draw(ctx);
    }

    localPlayer.draw(ctx);

    if(remotePlayer) {
        remotePlayer.draw(ctx);
    }

    if( gameState === gameStates.ACTIVE_ROUND ||
        gameState === gameStates.ROUND_START ||
        gameState === gameStates.PLAYER_SCORED ||
        gameState === gameStates.GAME_OVER) {
        displayScores(playerScores);
    }
}

function displayMessage() {
    ctx.save();
    ctx.font = "30px Comic Sans MS";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText(screenMessage,
        gameConstants.ARENA_WIDTH / 2,
        gameConstants.ARENA_HEIGHT / 2);
    ctx.restore();
}

function displayScores(scores) {
    ctx.save();
    ctx.font = "45px Comic Sans MS";
    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.fillText(scores[0] + " - " + scores[1],
        gameConstants.ARENA_WIDTH / 2,
        gameConstants.ARENA_HEIGHT / 4);
    ctx.restore();
}

/**************************************************
** COLLISIONS
**************************************************/
function handleCollisions() {
    if(ballIsCollidingWithWall()) {
        handleBallToWallCollision();
    }
    if(ballIsCollidingWithPlayer()) {
        handleBallPlayerCollision();
    }
    if(pointWasScored()) {
        handlePointScore();
    }
}

function ballIsCollidingWithWall() {
    var position = ball.getPos();
    return (position.y <= ballRadius) || (position.y + ballRadius >= 400);
}

function handleBallToWallCollision () {
    var position = ball.getPos(),
        currentVel = ball.getVel(),
        newY,
        newPos,
        newVel;

    if(position.y <= ballRadius) {
        newPos = new Vector([position.x, ballRadius + 1]);
    } else {
        newPos = new Vector([position.x, 400 - ballRadius - 1]);
    }

    newVel = new Vector([currentVel.x, -currentVel.y]);
    ball.setPos(newPos);
    ball.setVel(newVel);
}

function ballIsCollidingWithPlayer() {
    var ballPos = ball.getPos();

    return localPlayer.collidesWithBall(ballPos, ballRadius) ||
            remotePlayer.collidesWithBall(ballPos, ballRadius);
}

function handleBallPlayerCollision() {
    var ballPos = ball.getPos(),
        currentVel = ball.getVel(),
        playerCenter,
        newBallVel;

    if(ballPos.x < 100) {
        playerCenter  = localPlayer.getCenter();
    } else {
        playerCenter = remotePlayer.getCenter();
    }

    newBallVel = ballPos.minus(playerCenter);
    newBallVel.toMagnitude(currentVel.magnitude * 1.05);

    ball.setVel(newBallVel);
}

function pointWasScored() {
    var ballPos = ball.getPos();
    return ballPos.x + ballRadius <= 0 || ballPos.x - ballRadius >= gameConstants.ARENA_WIDTH;
}

function handlePointScore() {
    var ballPos = ball.getPos();

    gameState = gameStates.PLAYER_SCORED;
    showMessage = true;

    if(ballPos.x < 10) {
        screenMessage = gameStrings.PLAYER_2_SCORED;
        playerScores[1] += 1;
    } else {
        screenMessage = gameStrings.PLAYER_1_SCORED;
        playerScores[0] += 1;
    }

    socket.emit("broadcast event", {
        eventName: "player score",
        data: {
            scores: playerScores
        }
    });
    window.setTimeout(startCountdown, 2000, startRound);
}
