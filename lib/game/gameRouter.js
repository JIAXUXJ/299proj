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
var socket  = require('../util/io.js').connect('/game');
var game    = express.Router();

/*	view the current state of a game, once.
 */
game.get('/:gid/', function(req, res){
	var id = req.params.gid;
	var board = stad.getGameData(gid, function(data){
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

game.get('/:gid/obs', function(req, res){
	var gid = req.params.gid;
	req.status(200).send('Please emit a socket.io \'observe-register\' event with the data { "gid" : ' + gid + ' }.')
	/* vv not sure if this works! vv
	var socket = io.connect();
	socket.emit('observe-prompt', { 'gid' : id });
	*/
});

/* add an observer socket to a room.
 * a game's socket.io room should be identified by that game's `gid`.
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
game.post('/:gid/', function(req, res){
	var gid = req.params.gid;
	var move = req.body.data;
	auth.authorizeMove(req, function(auth_good){
		if(auth_good){
			stad.makeMove(id, move, function(data){
				if(data){
					res.sendStatus(200);
				} else {
					res.status(400).send('Bad request - move could not be made');
				}
				io.sockets.in(gid).emit('update', data); 
			});
		} else {
			res.sendStatus(403);
		}
	});
});

game.get('/list' function(req, res){
	db.getActiveGames(function(data){
		if(!data){
			res.status(401).send('Whoops! We can\'t find any active games.');
		} else {
			//sanitize information!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
		}
	});
});

module.exports = game;
