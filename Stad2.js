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
	var b = _genBoard(size);
}

function getGame(gid, cb){

}

function newMove(gid, move, cb){

}


// == Internal functions to Stadium.js ==
 
function _apply(move, game){

} 

function _isValid(move, game){

}

/* generate an NxN matrix of zeroes, where N = size
 */
function _genBoard(size){
	return new Array(size).fill(new Array(size).fill(0));
}
