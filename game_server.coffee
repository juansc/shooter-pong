util = require 'util'
io = require 'socket.io'
Player = require('./Player').Player
port = process.env.PORT || 8000

players = []
socket = {}



init = ->
  players = []
  socket = io port, {
    "transports": ["websocket"]
  }

setEventHandlers = ->
  socket.sockets.on 'connection', onSocketConnection

onSocketConnection = (client) ->
  util.log "New player has connected: #{client.id}"
  client.on 'disconnect', onClientDisconnect
  client.on 'new player', onNewPlayer
  client.on 'move player', onMovePlayer

onClientDisconnect = ->
  util.log "Player has disconnected: #{this.id}"
  [player, ind] = playerByID this.id
  if ind is -1
    return util.log "Could not find player #{this.id}"

  players.splice ind, 1
  this.broadcast.emit 'remove player', id: this.id


onNewPlayer = (data) ->
  newPlayer = new Player data.x, data.y
  newPlayer.id = this.id
  # This emits to all but the current player
  this.broadcast.emit 'new player',
    id: newPlayer.id,
    x: newPlayer.getX()
    y: newPlayer.getY()
  for player in players
    # This emits to only the current player
    this.emit 'new player',
      id: player.id
      x: player.getX()
      y: player.getY()
  players.push newPlayer


onMovePlayer = (data) ->
  [movePlayer, ind] = playerByID this.id
  unless movePlayer
    return console.log "Player not found: #{this.id}"
  movePlayer.setX data.x
  movePlayer.setY data.y
  this.broadcast.emit "move player",
    id: movePlayer.id
    x: movePlayer.getX()
    y: movePlayer.getY()

playerByID = (id) ->
  for player, ind in players
    return [player, ind] if player.id is id
  return [null, -1]

console.log "Server up on #{port}"

init()
setEventHandlers()

