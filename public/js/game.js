// TODO: Fix how we add new players on the client side.

/**************************************************
** GAME VARIABLES
**************************************************/
var canvas,         // Canvas DOM element
    ctx,            // Canvas rendering context
    keys,           // Keyboard input
    localPlayer,    // Local player
    remotePlayers,  // Remote players
    socket,         // Player socket
    ARENA_WIDTH = 800,
    ARENA_HEIGHT = 400,
    DISTANCE_TO_EDGE = 20,
    STARTING_Y = ARENA_HEIGHT / 2,
    STARTING_X_LEFT = DISTANCE_TO_EDGE,
    STARTING_X_RIGHT = ARENA_WIDTH - DISTANCE_TO_EDGE;


/**************************************************
** GAME INITIALISATION
**************************************************/
function init() {
    // Declare the canvas and rendering context
    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");

    // Initialise the local player
    socket = io('http://localhost:8000/',{ transports: ["websocket"] });

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
    socket.on("remove player", onRemovePlayer);
    socket.on("added to room", onAddedToRoom);
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
    var newPlayer = new Paddle(new Vector([data.x, data.y]), data.isOnLeft);
    newPlayer.id = data.id;
    remotePlayers.push(newPlayer);
};

function onMovePlayer(data) {
    var movePlayer = playerById(data.id);

    if (!movePlayer) {
        console.log("Player not found: "+data.id);
        return;
    };

    movePlayer.setPos(new Vector([data.x, data.y]));

};

function onRemovePlayer(data) {
    console.log(data)
    var removePlayer = playerById(data.id);

    if (!removePlayer) {
        console.log("Player not found: " + data.id);
        return;
    };

    remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
};

function onAddedToRoom(data) {
    var isOnLeft = data.isOnLeft,
        playerX, playerY;

    playerX = isOnLeft ? STARTING_X_LEFT : STARTING_X_RIGHT;
    playerY = ARENA_HEIGHT / 2;
    localPlayer = new Paddle(new Vector([playerX, playerY]), isOnLeft);

    socket.emit("new player", {
        x: localPlayer.getPos().x,
        y: localPlayer.getPos().y,
        isOnLeft: isOnLeft
    });

    keys = new Keys();
    animate();

}

/**************************************************
** GAME ANIMATION LOOP
**************************************************/
function animate() {
    update();
    draw();

    // Request a new animation frame using Paul Irish's shim
    window.requestAnimFrame(animate);
};


/**************************************************
** GAME UPDATE
**************************************************/
function update() {
    if (localPlayer.update(keys)) {
        socket.emit("move player", {
            x: localPlayer.getPos().x,
            y: localPlayer.getPos().y});
    };
};

function playerById(id) {
    var i;
    for (i = 0; i < remotePlayers.length; i++) {
        if (remotePlayers[i].id == id)
            return remotePlayers[i];
    };

    return false;
};

/**************************************************
** GAME DRAW
**************************************************/
function draw() {
    // Wipe the canvas clean
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw the local player
    localPlayer.draw(ctx);
    for (var i = 0; i < remotePlayers.length; i++) {
        remotePlayers[i].draw(ctx);
    };
};