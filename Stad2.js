/*
 * Stadium.js - game logic
 */

// == Imports ==
	var uuid   = require('node-uuid');
	var db     = require('../db/MongoDB.js');
	var logger = require('../util/logger.js');

// == Constants ==

// == External functions ==
function newGame(black, white, size, cb){
	var id = uuid.v4();
	var startDate = new Date();
	var board = _genBoard(size);
	
	var gameObject = {
		"_id": id,
		"TimeStart": startDate,
		"TimeEnd": startDate,
		"BoardSize": size,
		"Board": board,
		"moves": [],
		"PWhiteID": white,
		"PBlackID": black,
		"WhiteCaptures": 0,
		"BlackCaptures": 0,
		"State": "ACTIVE",
		"Turn": "BLACK",
	};
	
	db.newGame(gameObject, function(gid){
		cb(gid);
	});
}

function getGame(gid, cb){
	db.getGameById(gid, function(data){
		// Protection against Mongo retrieving the wrong game.
		if((!data) || (data._id != gid) {
			logger.info('Stadium/getGame: passed ' + gameID +', but was returned ' 
			+ data._id);
			cb(null);
		} 
		else {
			cb(data);
		}
	});
}

function endGame(gameObject, cb){
	var scores = _tally(gameObject);
}

function newMove(gid, move, cb){
	db.getGameById(gid, function(data) {
		if((!data) || data._id != gid) {
			cb(null);
			return;
		}
		if (data.State == "DONE"){
			logger.info("Stadium/newMove: attempted write to finished game "
			+ data._id);
			cb(data);
			return;
		}
		if ((move.pass) && (moves[moves.length - 1].pass)){
			endGame(data);
		}
	});
}


// == Internal functions to Stadium.js ==
 
function _apply(move, gameObject){

} 

function _isValid(move, gameObject){

}

function _tally(gameObject){
	var scores = {
		"White" : 0,
		"Black" : 0,
	}
	gameObject.Board.map(function(row){
		row.map(function(elem){
			if(elem == 'White'){
				scores.White += 1;
			} else if (elem == 'Black'){
				scores.Black += 1;
			}
		});
	});
	return scores;
}

/* generate an NxN matrix of zeroes, where N = size
 */
function _genBoard(size){
	return new Array(size).fill(new Array(size).fill(0));
}
