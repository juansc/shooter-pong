var Ball = function(pos, vel) {
    var pos = pos,
        vel = vel,
        radius = 5;

    var getPos = () => {return x};
    var getVel = () => {return y};
    var setPos = (newPos) => {pos = newPos};
    var setVel = (newVel) => {vel = newVel};


    var update = () => {
        if(collidingWithWall()) {
            handleWallCollision();
        } else if (collidingWithPlayer()) {
            handlePlayerCollision();
        } else {
            currentPos = getPos();
            currentVel = getVel();
            currentPos.add(currentVel);
        }
    };

    var draw = (ctx) => {
        currentPos = getPos();
        currentX = currentPos.elements[0];
        currentY = currentPos.elements[1];
        ctx.save();
        ctx.fillStyle("red");
        ctx.beginPath();
        ctx.arc(currentX,currentY,
                radius, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fill();
        ctx.closePath();
        ctx.restore();
    };

    return {
        getPos: getPos,
        getVel: getVel,
        setPos: setPos,
        setVel: setVel,
        update: update,
        draw: draw
    }
};