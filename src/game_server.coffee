socketio = require './socketio'
Player = require('./Player').Player
port = process.env.PORT || 8000

socketio.listen port

