class Player
  constructor: (startX, startY) ->
    @x = startX
    @y = startY
    @id = 0

  getX: => @x
  getY: => @y
  setX: (newX) => @x = newX
  setY: (newY) => @y = newY

exports.Player = Player