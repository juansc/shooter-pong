var Ball = function(pos, vel, radius) {
    var pos = pos,
        vel = vel,
        radius = radius || 10,
        currentPos,
        currentVel;

    var getPos = () => {return pos};
    var getVel = () => {return vel};
    var setPos = (newPos) => {pos = newPos};
    var setVel = (newVel) => {vel = newVel};

    var update = () => {
        currentPos = getPos();
        currentVel = getVel();
        currentPos.add(currentVel);
    };

    var draw = (ctx) => {
        currentPos = getPos();
        var currentX = currentPos.x,
            currentY = currentPos.y;
        ctx.save();

        ctx.beginPath();
        ctx.fillStyle = "red";
        ctx.arc(currentX, currentY,
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