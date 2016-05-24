/**************************************************
** GAME KEYBOARD CLASS
**************************************************/
var Keys = function(up, left, right, down) {
	var UP_KEY = 38,
	    LEFT_KEY = 37,
	    DOWN_KEY = 40,
	    RIGHT_KEY = 39,
	    SPACE_KEY = 32;

	var up = up || false,
		left = left || false,
		right = right || false,
		down = down || false;

	var onKeyDown = function(e) {
		var that = this,
			c = e.keyCode;
		switch (c) {
			// Controls
			case LEFT_KEY: // Left
				that.left = true;
				break;
			case UP_KEY: // Up
				that.up = true;
				break;
			case RIGHT_KEY: // Right
				that.right = true; // Will take priority over the left key
				break;
			case DOWN_KEY: // Down
				that.down = true;
				break;
		};
	};

	var onKeyUp = function(e) {
		var that = this,
			c = e.keyCode;
		switch (c) {
			case LEFT_KEY: // Left
				that.left = false;
				break;
			case UP_KEY: // Up
				that.up = false;
				break;
			case RIGHT_KEY: // Right
				that.right = false;
				break;
			case DOWN_KEY: // Down
				that.down = false;
				break;
		};
	};

	return {
		up: up,
		left: left,
		right: right,
		down: down,
		onKeyDown: onKeyDown,
		onKeyUp: onKeyUp
	};
};