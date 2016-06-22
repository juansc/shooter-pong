// TODO:
// 1) Add scoring system.
// 2) Add all responsibilities to host player.
// 3) Make all variables invisible

/**************************************************
** GAME VARIABLES
**************************************************/
var canvas,         // Canvas DOM element
    ctx,            // Canvas rendering context
    keys,           // Keyboard input
    localPlayer,    // Local player
    remotePlayers,  // Remote players
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
    isHost = false;


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
    // Declare the canvas and rendering context
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");
    gameStates = GameStates();
    gameConstants = GameConstants();
    gameStrings = GameStrings();

    gameState = gameStates.WAITING_FOR_OTHER_PLAYER;
    screenMessage = gameStrings.WAITING_FOR_PLAYER;

    // Initialise the local player
    try{
        socket = io('http://localhost:8000/',{ transports: ["websocket"] });
    } catch(e) {
        screenMessage = gameStrings.UNABLE_TO_CONNECT;
        return;
    }

    // Start listening for events
    setEventHandlers();
    remotePlayers = [];

    console.log(socket);
};


/**************************************************
** GAME EVENT HANDLERS
**************************************************/
var setEventHandlers = function() {
    // Keyboard
    window.addEventListener("keydown", onKeydown, false);
    window.addEventListener("keyup", onKeyup, false);

    // Window resize
    //window.addEventListener("resize", onResize, true);

    socket.on("connect", onSocketConnected);
    socket.on("disconnect", onSocketDisconnect);
    socket.on("new player", onNewPlayer);
    socket.on("move player", onMovePlayer);
    socket.on("move ball", onMoveBall);
    socket.on("remove player", onRemovePlayer);
    socket.on("added to room", onAddedToRoom);
    socket.on("start game", onStartGame);
};

// Keyboard key down
function onKeydown(e) {
    if (localPlayer) {
        keys.onKeyDown(e);
    };
};

// Keyboard key up
function onKeyup(e) {
    if (localPlayer) {
        keys.onKeyUp(e);
    };
};

// Browser window resize
function onResize(e) {
    // Maximise the canvas
    canvas.width = ARENA_WIDTH;
    canvas.height = ARENA_HEIGHT;
};

function onSocketConnected() {
    console.log("Connected to socket server");
};

function onSocketDisconnect() {
    console.log("Disconnected from socket server");
};

function onNewPlayer(data) {
    console.log("New player connected: " + data.id);
    var newPlayer = new Paddle(new Vector([data.x, data.y]), data.isHost);
    newPlayer.id = data.id;
    remotePlayers.push(newPlayer);
};

function onMovePlayer(data) {
    var playerToMove = playerById(data.id);

    if (!playerToMove) {
        console.log("Player not found: "+data.id);
        return;
    };

    playerToMove.setPos(new Vector([data.x, data.y]));

};

function onMoveBall(data) {
    ball.setPos(new Vector([data.x, data.y]));
}

function onRemovePlayer(data) {
    console.log(data)
    var playerToRemove = playerById(data.id);

    if (!playerToRemove) {
        console.log("Player not found: " + data.id);
        return;
    };

    remotePlayers.splice(remotePlayers.indexOf(playerToRemove), 1);
};

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
};

function hideWaitingForPlayerMessage() {
    showMessage = false;
    console.log("Hid waiting for players message");
}

function startGame() {
    console.log("Game is starting");
    screenMessage = "Game is starting!";
    resetScores();
    //showScores();
    startRound();
    console.log("We go here");
};

function resetScores() {
    var scores = [0,0];
};

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
};

function onStartGame() {
    screenMessage = gameStrings.STARTING_GAME;
    gameState = gameStates.STARTING_GAME;
    startCountdown(startGame);
};

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
};

function clearCountdown() {
    console.log("Cleared countdown");
    window.clearInterval(countdownID);
};



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
};


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
};

function playerById(id) {
    var i;
    for (i = 0; i < remotePlayers.length; i++) {
        if (remotePlayers[i].id == id) {
            return remotePlayers[i];
        }
    };

    return false;
};

/**************************************************
** GAME DRAW
**************************************************/
function draw() {
    // Wipe the canvas clean
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(showMessage) {
        ctx.save();
        ctx.font = "30px Comic Sans MS";
        ctx.fillStyle = "red";
        ctx.textAlign = "center";
        ctx.fillText(screenMessage,
            gameConstants.ARENA_WIDTH / 2,
            gameConstants.ARENA_HEIGHT / 2);
        ctx.restore();
    }
    if(gameState === gameStates.ACTIVE_ROUND && ball) {
        ball.draw(ctx);
    }
    // Draw the local player
    localPlayer.draw(ctx);
    for (var i = 0; i < remotePlayers.length; i++) {
        remotePlayers[i].draw(ctx);
    };
};

/**************************************************
** COLLISIONS
**************************************************/
function handleCollisions() {
    var scoringPlayer;
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
};

function ballIsCollidingWithPlayer() {
    var ballPos = ball.getPos();

    return localPlayer.collidesWithBall(ballPos, ballRadius) ||
            remotePlayers[0].collidesWithBall(ballPos, ballRadius);
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
};

function handleBallPlayerCollision() {
    var ballPos = ball.getPos(),
        playerCenter,
        currentVel = ball.getVel(),
        newBallVel;

    if(ballPos.x < 100) {
        playerCenter  = localPlayer.getCenter();
    } else {
        playerCenter = remotePlayers[0].getCenter();
    }

    newBallVel = ballPos.minus(playerCenter);
    newBallVel.toMagnitude(currentVel.magnitude * 1.05);

    ball.setVel(newBallVel);
};

function pointWasScored() {
    var ballPos = ball.getPos();
    return ballPos.x + ballRadius <= 0 || ballPos.x - ballRadius >= gameConstants.ARENA_WIDTH;
}

function handlePointScore() {
    gameState = gameStates.PLAYER_SCORED;
    showMessage = true;
    var ballPos = ball.getPos();

    if(ballPos.x < 10) {
        screenMessage = "Player on right scored";
    } else {
        screenMessage = "Player on left scored";
    }

    window.setTimeout(startCountdown, 2000, startRound);

};