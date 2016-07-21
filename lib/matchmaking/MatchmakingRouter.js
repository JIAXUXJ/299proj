"use strict";

/*
 * Matchmaking SubAPI - Handles matching of players and/or bots
 * for Go games, and passes player information along to the Game
 * module.
 */

//IMPORTS
var router      = require('express').Router();
var mongo       = require('../db/MongoDB.js');
var mmConfig    = require('../../config.js').matchmaking;
var io          = require('../util/io.js');
var BotRegistry = require('../bot/BotRegistry.js');
var stadium      = require('../game/Stadium.js');

router.use(function(req, res, next) {
    req.session.gameState = mmConfig.playerStates.ACTIVE;
    next();
});

/*
 * Gets all active human players from the database and returns them
 * as JSON to the client.
 */
router.get('/match/activePlayers', function(req, res) {

    var reqId = req.session.pid;

    mongo.getActiveSessions(function(data) {

        if (data == null) {
            res.status(500).send('Failed to access session data.');
        }
        else {
            res.json(data);
        }

    });

});

/*
 * Gets all active AI players and returns them as JSON to the client.
 */
router.get('/match/activeBots', function(req, res) {

    var keys = [];
    for (var name in BotRegistry) {
        keys.push(name);
    }
    res.json(keys);

});

/*
 * Sets a player's status to WAITING for a game, and responds to the
 * user if an opponent has been found.
 *
 * Responds with OPPONENT_NOT_FOUND if no human player can be found.
 */
router.post('/match/waitForRandom', function(req, res) {

    mongo.getWaitingSessions(function(users) {

        req.session.gameState = mmConfig.playerStates.WAITING;

        if (users !== null) {

            // if no opponent can be found, wait for challenges
            setTimeout(function() {

                if (req.session.gameState === mmConfig.playerStates.WAITING) {
                    res.send('OPPONENT_NOT_FOUND');
                }

            }, mmConfig.RANDOM_WAIT_TIMEOUT);

        }
        else {
            var opponent = users[0];
            res.redirect('/match/challenge?sessionID=' + users[0].session.pid);
        }

    })

});

/*
 * Matches the player with a random AI player.
 */
router.post('/match/randomBot', function(req, res) {

    var keys = Object.keys(BotRegistry);
    var keyInd = Math.floor(Math.random() * keys.length);
    var bot = BotRegistry[keys[keyInd]];
    //TODO: start game with bot

});

/*
 * Allows the client to CHALLENGE other users or an AI player to a
 * game.  Requires that a session ID in an ACTIVE or WAITING state is
 * provided in the request body.
 */
router.post('/match/challenge', function(req, res) {

    // check session is ACTIVE
    mongo.getSessionById(req.body.sessionID, function(data) {

        // reject if session non-existent or in wrong state
        if (data === null ||
            (data.gameState !== mmConfig.playerStates.ACTIVE
              && data.gameState !== mmConfig.playerStates.WAITING)) {

            res.status(406).send('Invalid session ID.');
            return;

        }

        io.emit(mmConfig.CHALLENGE_TOPIC, {
            sessionID : req.body.sessionID,
            //TODO: user name
        });

        res.send("Sent.");

    });

});

/*
 * Starts a local "hot seat" game and redirects users to it.
 */
router.post('/match/startHotSeat', function(req, res) {

    // create new game and redirect
    stadium.newGame(req.sessionID, req.sessionID, req.body.boardSize, function(id) {
        res.redirect('/game/' + id);
    });

});

module.exports = router;