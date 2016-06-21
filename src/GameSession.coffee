class GameSession
  constructor: (host, ID = 0) ->
    players = []
    game_ID = 0
    game_host = {}
    num_of_players = 0
    if host
      players[0] = host
      game_host = host
      num_of_players += 1
    game_ID = ID

    @getNumberOfPlayers = ->
      num_of_players

    @addPlayer = (player) ->
      return if num_of_players is 2
      game_host = player if not game_host
      players[num_of_players] = player
      num_of_players += 1

    @removePlayer = (player) ->
      if player not in players
        return console.log "Player #{player.id} not in session #{game_ID}"
      if player is game_host
        game_host = players[1]
        players[0] = game_host
      players[1] = null
      num_of_players -= 1
      return

    @getSessionID = -> game_ID

    @setSessionID = (ID)-> game_ID = ID

    @getSessionHost = -> game_host

    @restartSession =  ->
      players = []
      game_ID = 0
      game_host = {}

module.exports = GameSession