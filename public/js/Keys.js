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
		down = down || false,
		space = false;

	var onKeyDown = function(e) {
		switch (e.keyCode) {
			// Controls
			case LEFT_KEY: // Left
				this.left = true;
				break;
			case UP_KEY: // Up
				this.up = true;
				break;
			case RIGHT_KEY: // Right
				this.right = true; // Will take priority over the left key
				break;
			case DOWN_KEY: // Down
				this.down = true;
				break;
			case SPACE_KEY:
				this.space = true;
				break;
		};
	};

	var onKeyUp = function(e) {
		switch(e.keyCode) {
			case LEFT_KEY:
				this.left = false;
				break;
			case UP_KEY:
				this.up = false;
				break;
			case RIGHT_KEY:
				this.right = false;
				break;
			case DOWN_KEY:
				this.down = false;
				break;
			case SPACE_KEY:
				this.space = false;
				break;
		};
	};

	return {
		up: up,
		left: left,
		right: right,
		down: down,
		space: space,
		onKeyDown: onKeyDown,
		onKeyUp: onKeyUp
	};
};