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
var socket  = require('../io/io.js').connect('/game');
var game    = express.Router();

/*	view the current state of a game, once.
 */
game.get('/:id/', function(req, res){
	var id = req.params.id;
	var board = stad.getBoardState(id, function(data){
		if(data){
			res.json(data);
		} else {
			res.status(400).send('Bad request - game could not be retrieved');
	});
});

/*	register as an observer to a game, and so, receive `socket.io` pushes.
 *	since this is handled using a socket.io `event`, this route is simply a
 *	dummy function that will prompt the client to emit that event.
 */

game.get('/:id/obs', function(req, res){
	var id = req.params.id;
	req.status(200).send('Please emit a socket.io \'observe-register\' event with the data { "gid" : <gameid> }.')
	/* vv not sure if this works! vv
	var socket = io.connect();
	socket.emit('observe-prompt', { 'gid' : id });
	*/
});

/*	add an observer socket to a room.
 */
io.on('connection', function(socket){
	socket.on('observe-register', function(gid){
		socket.join(gid, function(err){
			console.log('error in gameRouter.io.on(\'observe-register\'):\n\t' + err);	
		});
	});
});

/* make a move to a game, by POSTing the desired JSON move object.
 */
game.post('/:id/', function(req, res){
	var id = req.params.id;
	var move = req.body.data;
	auth.authorizeMove(req, function(auth_good){
		if(auth_good){
			stad.makeMove(id, move, function(move_good){
				if(move_good){
					res.sendStatus(200);
				} else {
					res.status(400).send('Bad request - move could not be made');
				}
			});
		} else {
			res.sendStatus(403);
		}
	});
});

module.exports = game;
