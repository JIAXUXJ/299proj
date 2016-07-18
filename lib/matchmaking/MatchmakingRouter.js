"use strict";

/*
 * Matchmaking SubAPI - Handles matching of players and/or bots
 * for Go games, and passes player information along to the Game
 * module.
 */

//IMPORTS
var router = require('express').Router();
var mongo  = require('../db/MongoDB.js');

/*
 * Gets all active human players from the database and returns them
 * as JSON to the client.
 */
router.get('/match/activePlayers', function(req, res) {

    var reqId = req.sessionID;

    mongo.getActiveSessions(function(data) {

        if (data == null) {
            res.status(500).send('Failed to access session data.');
        }
        else {
            res.JSON(data);
        }

    });

});

/*
 * Gets all active AI players and returns them as JSON to the client.
 */
router.get('/match/activeBots', function(req, res) {
    //TODO
});

/*
 * Sets a player's status to WAITING for a game, and responds to the
 * user if an opponent has been found.
 *
 * Responds with NOT_FOUND if no human player can be found.
 */
router.post('/match/waitForRandom', function(req, res) {
    //TODO
});

/*
 * Matches the player with a random AI player.
 */
router.post('/match/randomBot', function(req, res) {
    //TODO
});

/*
 * Allows the client to CHALLENGE other users or an AI player to a
 * game.
 */
router.post('/match/challenge', function(req, res) {
    //TODO
});

module.exports = router;