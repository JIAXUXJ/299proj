/*
 * Stadium.js - game logic
 */

// == Imports ==
	var uuid   = require('node-uuid');
	var db     = require('../db/MongoDB.js');
	var logger = require('../util/logger.js');

// == Constants ==


class Stadium {
// == External functions ==

/* Initialise a new game. The meat of this function is assembling the gameObject
 * in proper JSON.
 */
newGame(black, white, size, cb){
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
		"whitePlayer": "unresolved",
		"blackPlayer": "unresolved",
		"WhiteCaptures": 0,
		"BlackCaptures": 0,
		"State": "ACTIVE",
		"Turn": "BLACK",
	};
	
	db.newGame(gameObject, function(gid){
		cb(gid);
	});
}

/* Access a game. This function is borderline redundant. The distinguishing
 * feature between it and db.getGameById is protection against returning games
 * other than the one requested (although the change of Mongo doing this is
 * near zero).
 */
getGame(gid, cb){
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

/* Finish a game. Count the scores, deanonymize users, and other cleanup.
 * Then, write the game to MongoDB. Finally, return the game object.
 */
endGame(gameObject, cb){

	//tag game as DONE with ending time
	gameObject.State = "DONE";
	gameObject.TimeEnd = new Date();
	
	//tally scores
	var scores = _tally(gameObject);
	gameObject.WhiteCaptures += scores.White;
	gameObject.BlackCaptures += scores.Black;
	
	//resolve White user account
	getSessionByID(game.PWhiteID, function(data){
		if(!data){
			//no user account. it was a mysterious player without name.
			gameObject.whitePlayer = "Anon";
		} else {
			gameObject.whitePlayer = data.userName;
		}
	});
	
	//resolve Black user account
	getSessionByID(game.PBlackID, function(data){
		if(!data){
			//no user account. it was a mysterious player without name.
			gameObject.blackPlayer = "Anon";
		} else {
			gameObject.blackPlayer = data.userName;
		}
	});
	
	//If the closing write fails...
	db.updateGameById(gameObject._id, gameObject, function(write_ok){
		//...there's nothing more we can do (for now).
		if(!write_ok){
			logger.info("Stadium/endGame:Bad write on ending game " + gameObject._id);
		}
	});
	//In any case, return the new gameObject to the user.
	cb(gameObject);
}

/* Push a move to a game. Check if the move is to a finished game, or if it will
 * end the game (i.e., a pass). Otherwise, check if it's valid. If so, apply it
 * to the board.
 */
newMove(gid, move, cb){
	db.getGameById(gid, function(data) {
	
		//If there's no game or a different game found, return null.
		if((!data) || data._id != gid) {
			cb(null);
			return;
		}
		
		//If the game's finished, return the game state without doing anything.
		if (data.State == "DONE"){
			logger.info("Stadium/newMove: attempted write to finished game "
			+ data._id);
			cb(data);
			return;
		}
		
		//If both players pass then thassallshewrote
		if ((move.pass) && (moves[moves.length - 1].pass)){
			endGame(data, function(data){
				cb(data);
			});
			return;
		}
	});
}

// == Internal functions to Stadium.js ==
 
_apply(move, gameObject){

} 

_isValid(move, gameObject){

}

/* Tally remaining pieces on the board at game end. Returns a two-field JSON.
 */
_tally(gameObject){
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

/* Returns an NxN matrix of zeroes, where N = size.
 */
_genBoard(size){
	return new Array(size).fill(new Array(size).fill(0));
}

module.exports = {
	stadium : new Stadium()
}
