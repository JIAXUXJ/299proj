"use strict";

/* ExpressJS router for game interaction over the network.`
 * gameRouter.js has two main functions:
 * - broadcast games (using socket.io) to interested parties (incl. the two players).
 * - handle and authorize moves (using auth.js) from the network (using XHR POST).
 * auth: alex
 */

var express = require('express');
var stad    = require('../game/gameStadium.js');
var auth    = require('../auth/auth.js');
var game    = express.Router();

/*	view the current state of a game, once.
 */
game.get('/:id/', function(req, res){
	var id = req.params.id;
	var board = stad.getBoardState(id);
});

/*	register as an observer to a game, and so, receive `socket.io` pushes.
 *
 */

game.get('/:id/obs', function(req, res){

});

/* make a move to a game, by POSTing the desired JSON move object.
 */
game.post('/:id/', function(req, res){
	var id = req.params.id;
	var move = req.body.data;
	auth.authorizeMove(req, function(success){
		if(success){
			stad.makeMove(id, move);
		}
		else{
			res.sendStatus(403);
		}
	});
});

module.exports = game;
