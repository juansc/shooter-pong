class Player
  ON_LEFT = 0
  ON_RIGHT = 1

  constructor: (startX, startY, isOnLeft) ->
    @x = startX
    @y = startY
    @id = 0
    @orientation = if isOnLeft then ON_LEFT else ON_RIGHT

  getX: => @x
  getY: => @y
  setX: (newX) => @x = newX
  setY: (newY) => @y = newY
  setGameSession: (gameSession) => @gameSession = gameSession
  isOnLeft: => @orientation is ON_LEFT

exports.Player = Player