/**************************************************
** GAME PLAYER CLASS
**************************************************/
var Player = function(startX, startY) {
    var x = startX,
        y = startY,
        id,
        moveAmount = 2;

    var getX = () => {return x};
    var getY = () => {return y};
    var setX = (newX) => {x = newX};
    var setY = (newY) => {y = newY};


    var update = (keys) => {
        var prevX = x,
            prevY = y;
        // Up key takes priority over down
        if (keys.up) {
            y -= moveAmount;
        } else if (keys.down) {
            y += moveAmount;
        };

        // Left key takes priority over right
        if (keys.left) {
            x -= moveAmount;
        } else if (keys.right) {
            x += moveAmount;
        };

        return (prevX != x || prevY != y) ? true : false;
    };

    var draw = (ctx) => {
        ctx.fillRect(x-5, y-5, 10, 10);
    };

    return {
        getX: getX,
        getY: getY,
        setX: setX,
        setY: setY,
        update: update,
        draw: draw
    }
};