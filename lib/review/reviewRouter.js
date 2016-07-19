/*
 * Express router for reviewing finished games.
 */


var express = require('express');
var db      = require('../db/MongoDB.js');
var review  = express.Router();

// CONSTANTS
const GAME_STATUS_VAR    = 'status';
const GAME_STATUS_OVER   = 'over';
const GAME_STATUS_ACTIVE = 'active';

/*	list some or all of the old games archived for view (using pagination).
 */
review.get('/list/:pg', function(req,res){
	var page = req.params.pg;
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
