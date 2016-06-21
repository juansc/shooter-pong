var Paddle = function(pos, isOnLeft) {
    var pos = pos,
        id,
        speed = 2,
        height = 80,
        width = 10,
        ySlant = 10,
        ON_LEFT = 0,
        ON_RIGHT = 1,
        orientation,
        MAX_Y = 400 - height,
        MIN_Y = 0;

    orientation = isOnLeft ? ON_LEFT:ON_RIGHT;

    var getPos = () => {return pos};
    var setPos = (newPos) => {pos = newPos};
    var isOnLeft = () => {return orientation === ON_LEFT};

    var collidingWithWall = () => {return false;}

    var update = (keys) => {
        var currentPos = getPos(),
            prevY = currentPos.elements[1],
            positionChanged = true;

        if(collidingWithWall()) {
            positionChanged = handleWallCollision();
        } else{
            if (keys.up && !keys.down) {
                currentPos.elements[1] = Math.max(prevY - speed, MIN_Y);
            } else if (keys.down && !keys.up) {
                currentPos.elements[1] = Math.min(prevY + speed, MAX_Y);
            } else{
                positionChanged = false;
            };
        }

        return positionChanged;
    };

    var draw = (ctx) => {
        var points = getPointsToDraw(isOnLeft());

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        ctx.lineTo(points[1].x, points[1].y);
        ctx.lineTo(points[2].x, points[2].y);
        ctx.lineTo(points[3].x, points[3].y);
        ctx.closePath();
        ctx.fillStyle = isOnLeft() ? "red":"blue";
        ctx.fill();
        ctx.restore();
        currentPos = getPos();
        var currentX = 400,//currentPos.elements[0],
            currentY = 50;//currentPos.elements[1];
        ctx.save();
    };

    var getPointsToDraw = (orientation) => {
        var points = [],
            currentPos = getPos(),
            p1x, p1y, p2x, p2y,
            p3x, p3y, p4x, p4y;

        p1x = currentPos.x;
        p1y = currentPos.y;
        p2x = p1x;
        p2y = p1y + height;
        p3x = p2x + width*(orientation ? 1: -1);
        p3y = p2y - ySlant;
        p4x = p3x;
        p4y = p1y + ySlant;
        points = [
            {x:p1x,y:p1y},
            {x:p2x,y:p2y},
            {x:p3x,y:p3y},
            {x:p4x,y:p4y}
        ];
        return points;
    }

    var getHitBox = (orientation) => {
        var points = [],
            currentPos = getPos(),
            p1x, p1y, p2x, p2y,
            p3x, p3y, p4x, p4y;

        p1x = currentPos.x + width*(orientation ? 1: -1);
        p1y = currentPos.y;
        p2x = p1x;
        p2y = p1y + height;
        points = [
            {x:p1x,y:p1y},
            {x:p2x,y:p2y}
        ];
        return points;
    }

    return {
        getPos: getPos,
        setPos: setPos,
        update: update,
        draw: draw,
        isOnLeft: isOnLeft,
        hitBox: () => {return getHitBox(orientation);}
    }
};