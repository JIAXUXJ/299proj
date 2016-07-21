/*
 * Express router for reviewing finished games.
 */


var express = require('express');
var db      = require('../db/MongoDB.js');
var review  = express.Router();

// CONSTANTS
const GAME_STATUS_VAR    = 'Status';
const GAME_STATUS_OVER   = 'DONE';
const GAME_STATUS_ACTIVE = 'ACTIVE';

/*	list the old games archived for view.
 */
review.get('/list', function(req,res){
	db.getDoneGames(function(data){
		if(data){
			res.status(200).json(data);
		} else {
			res.status(401).send('Oh no! We couldn\'t find any old games. Sorry.');
		}
	});
});


/* retrieve an old game by id.
 */
review.get('/:id', function(req,res){
	var id = req.params.id;
	db.getGameById(id, function(data){
		if (data){
			if(data.GAME_STATUS_VAR = GAME_STATUS_OVER){
				res.status(200).json(data);
			} else {
				res.status(403).send('Game still ongoing - please try /game/:id/sub to spectate.');
			}
		} else {
			res.status(401).send('Bad request - could not retrieve game.');	//even if it's a server-side error #devilish
		}
	});
});

module.exports = review;
