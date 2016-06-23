var Bullet = function(pos, facesLeft) {
	var FACES_LEFT = 0,
		FACES_RIGHT = 1,
        STARTING_ANGLE = Math.PI / 2,
        ENDING_ANGLE = - Math.PI / 2,
		bulletRadius = 3,
        bulletLength = 10;

	var pos,
		bulletVel = new Vector([10 * (facesLeft ? -1:1),0]),
		orientation = facesLeft ? FACES_LEFT : FACES_RIGHT;

    var getPos = () => {return pos;};
    var getVel = () => {return bulletVel;};

    var facesLeft = () => {return orientation === FACES_LEFT;};

    var update = () => {
        pos.add(bulletVel);
    };

	var draw = (ctx) => {
		var bulletPos = getPos(),
			bulletX = bulletPos.x,
			bulletY = bulletPos.y,
            p1x = bulletX,
            p1y = bulletY - bulletRadius,
            p2x = bulletX + (facesLeft() ? 1:-1)*bulletLength,
            p2y = p1y,
            p3x = p2x,
            p3y = p2y + 2*bulletRadius,
            p4x = p1x,
            p4y = p3y;

		ctx.save();
		ctx.strokeStyle = 'black';
		ctx.lineWidth = 2;

		ctx.beginPath();
		ctx.moveTo(p1x, p1y);
        ctx.lineTo(p2x, p2y);
        ctx.lineTo(p3x, p3y);
        ctx.lineTo(p4x, p4y);

        ctx.arc(bulletX, bulletY, bulletRadius,
                    Math.PI/2, -Math.PI/2, !facesLeft());
        ctx.fill();
        ctx.stroke();

		ctx.restore();
	}

    return {
        getPos: getPos,
        getVel: getVel,
        update: update,
        draw: draw
    }
};
