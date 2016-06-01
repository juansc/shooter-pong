class Player
  constructor: (startX, startY, orientation) ->
    @x = startX
    @y = startY
    @id = 0
    @orientation = orientation

  getX: => @x
  getY: => @y
  setX: (newX) => @x = newX
  setY: (newY) => @y = newY
  getOrientation: =>
    console.log @orientation
    @orientation

exports.Player = Player