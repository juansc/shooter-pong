util = require 'util'
io = require 'socket.io'
Player = require('./Player').Player
GameSession = require './GameSession'

players = []
# Array of room_sessions indexed by 0-29
room_sessions = (new GameSession(null, i - 1) for i in [1..30])
# Map from player ID to 0-29
player_current_room = {}
socket = {}

onClientDisconnect = ->
  util.log "Player has disconnected: #{this.id}"

  [player, ind] = playerByID this.id
  return util.log "Could not find player #{this.id}" if ind is -1

  room = player_current_room[this.id]
  player_session = player.gameSession
  player_session.removePlayer player.id

  players.splice ind, 1

  this.broadcast.to(room).emit 'remove player', id: this.id


onNewPlayer = (data) ->
  newPlayer = new Player data.x, data.y, data.isOnLeft
  newPlayer.id = this.id
  room = player_current_room[this.id]
  newPlayer.setGameSession room_sessions[room]

  # This emits to all but the current player
  this.broadcast.to("room #{room}").emit 'new player',
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
  return console.log "Player not found: #{this.id}" if ind is -1

  movePlayer.setX data.x
  movePlayer.setY data.y
  room = player_current_room[this.id]

  this.broadcast.to("room #{room}").emit "move player",
    id: movePlayer.id
    x: movePlayer.getX()
    y: movePlayer.getY()

playerByID = (id) ->
  for player, ind in players
    return [player, ind] if player.id is id
  return [null, -1]

onReadyUp = (data) ->
  room = player_current_room[this.id]

addClientToRoom = (client) ->
  found_room = false
  for session, room_number in room_sessions
    players_in_room = session.getNumberOfPlayers()
    if players_in_room < 2
      first_in_room = players_in_room is 0
      session.addPlayer client.id
      client.join "room #{room_number}"
      player_current_room[client.id] = room_number
      console.log "Added #{client.id} to room #{room_number}"
      client.emit 'added to room', isOnLeft: first_in_room
      found_room = true
      room_full = not first_in_room
      return [found_room, room_number, room_full]

  return [found_room, -1, false]

onClientConnected = (client) ->
  util.log "New player has connected: #{client.id}"
  addCallbacksToClient client
  [found_room, room, room_full] = addClientToRoom client
  return console.log "Could not find room for #{client.id}" if not found_room
  if room_full
    socket.in("room #{room}").emit 'start game'

addCallbacksToClient = (client) ->
  client.on 'disconnect', onClientDisconnect
  client.on 'new player', onNewPlayer
  client.on 'move player', onMovePlayer
  client.on 'ready up', onReadyUp

exports.listen = (port) ->
  players = []
  socket = io port, {transports: ["websocket"]}
  socket.sockets.on 'connection', onClientConnected

  console.log "Socket.io port listening on #{port}"