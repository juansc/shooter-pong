util = require 'util'
io = require 'socket.io'
Player = require('./Player').Player
GameSession = require './GameSession'

players = []
room_sessions = (new GameSession() for i in [1..30])
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
  newPlayer = new Player data.x, data.y, data.isOnLeft
  newPlayer.id = this.id
  room = player_current_room[this.id]
  # This emits to all but the current player
  this.broadcast.to(room).emit 'new player',
    id: newPlayer.id,
    x: newPlayer.getX()
    y: newPlayer.getY()
    isOnLeft: data.isOnLeft
  for player in players
    # This emits to only the current player
    if player_current_room[player.id] is room
      this.emit 'new player',
        id: player.id
        x: player.getX()
        y: player.getY()
        isOnLeft: player.isOnLeft()
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

addClientToRoom = (client) ->
  found_room = false
  for session, ind in room_sessions
    players_in_room = session.getNumberOfPlayers()
    if players_in_room < 2
      first_in_room = players_in_room is 0
      session.addPlayer client.id
      client.join "room #{ind}"
      player_current_room[client.id] = "room #{ind}"
      console.log "Added #{client.id} to room #{ind}"
      client.emit 'added to room', isOnLeft: first_in_room
      return found_room = true
  found_room

onClientConnected = (client) ->
  util.log "New player has connected: #{client.id}"
  addCallbacksToClient client
  found_room = addClientToRoom client
  console.log "Could not find room for #{client.id}" if not found_room

addCallbacksToClient = (client) ->
  client.on 'disconnect', onClientDisconnect
  client.on 'new player', onNewPlayer
  client.on 'move player', onMovePlayer

exports.listen = (port) ->
  players = []
  socket = io port, {transports: ["websocket"]}
  socket.sockets.on 'connection', onClientConnected

  console.log "Socket.io port listening on #{port}"