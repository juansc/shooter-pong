class GameSession
  constructor: (host, ID = 0) ->
    players = []
    game_ID = 0
    game_host = {}
    if host
      players.push host
      game_host = host
    game_ID = ID

    @getNumberOfPlayers = ->
      players.length

    @addPlayer = (player) ->
      return false if players.length >= 2
      if players.length is 0
        game_host = player
      players.push player

    @getSessionID = -> game_ID

    @setSessionID = (ID)-> game_ID = ID

    @getSessionHost = -> game_host

    @restartSession =  ->
      players = []
      game_ID = 0
      game_host = {}

module.exports = GameSession