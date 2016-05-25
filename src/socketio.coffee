util = require 'util'
io = require 'socket.io'
Player = require('./Player').Player
GameSession = require './GameSession'

# Keeps track of all player objects
players = []
room_sessions = (new GameSession() for i in [1..30])
# Current room for players
player_current_room = {}
socket = {}

onClientDisconnect = ->
  util.log "Player has disconnected: #{this.id}"

  [player, ind] = playerByID this.id
  return util.log "Could not find player #{this.id}" if ind is -1

  players.splice ind, 1
  room = player_current_room[this.id]
  this.broadcast.to(room).emit 'remove player', id: this.id


onNewPlayer = (data) ->
  newPlayer = new Player data.x, data.y
  newPlayer.id = this.id
  room = player_current_room[this.id]
  # This emits to all but the current player
  this.broadcast.to(room).emit 'new player',
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
  return console.log "Player not found: #{this.id}" unless movePlayer

  movePlayer.setX data.x
  movePlayer.setY data.y
  room = player_current_room[this.id]
  this.broadcast.to(room).emit "move player",
    id: movePlayer.id
    x: movePlayer.getX()
    y: movePlayer.getY()

playerByID = (id) ->
  for player, ind in players
    return [player, ind] if player.id is id
  return [null, -1]

exports.listen = (port) ->
  players = []
  socket = io port, {
    "transports": ["websocket"]
  }

  socket.sockets.on 'connection', (client) ->
    util.log "New player has connected: #{client.id}"
    client.on 'disconnect', onClientDisconnect
    client.on 'new player', onNewPlayer
    client.on 'move player', onMovePlayer
    found_room = false
    console.log room_sessions.length
    for session, ind in room_sessions
      if session.getNumberOfPlayers() < 2
        session.addPlayer client.id
        client.join "room #{ind}"
        player_current_room[client.id] = "room #{ind}"
        console.log "Added #{client.id} to room #{ind}"
        found_room = true
        break
    if not found_room
      console.log "Could not find room for #{client.id}"

  console.log "Socket.io port listening on #{port}"