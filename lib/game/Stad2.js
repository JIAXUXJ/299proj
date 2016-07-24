"use strict";
/*
 * Stadium.js - game logic
 */

// == Imports ==
	var uuid   = require('node-uuid');
	var db     = require('../db/MongoDB.js');
	var logger = require('../util/logger.js');

// == Constants ==
// ...

class Stadium {

// == External functions ==

/* Initialise a new game. The meat of this function is assembling the gameObject
 * in proper JSON.
 */
newGame(black, white, size, cb){
	var id = uuid.v4();
	var startDate = new Date();
	var board = this._genBoard(size);
	
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
		"Turn": "Black",
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
		if((!data) || (data._id != gid)){
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
	var scores = _tally(gameObject.Board);
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
		if(data.moves.length > 0){
			if ((move.pass) && (data.moves[data.moves.length - 1].pass)){
				endGame(data, function(data){
					cb(data);
				});
				return;
			}
		}

		
		//If the move is invalid, return without doing anything.
		if (!_isValid(move, data)){
			cb(data);
			return;
		}
		
		//Finally, the move is valid, and so we may apply it.
		data.Board[move.CoordX][move.CoordY] = move.Player;
		data = _capture(data);
		
		//And then, write it to the database.
		data.moves.push(move);
		db.updateGameById(gid, data, function(write_data){
				cb(write_data);
		});
	});
}

// == Internal functions to Stadium.js ==
 
_apply(move, gameObject){

} 

_isValid(move, gameObject){

}

/* Tally remaining pieces on the board at game end. Returns a two-field JSON.
 */
_tally(Board){
	var scores = {
		"White" : 0,
		"Black" : 0,
	}
	Board.map(function(row){
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

_randPop(size){
	var Board = this._genBoard(size);
	return Board.map(function(row){
		return row.map(function(elem){
			var rnd = Math.floor(Math.random() * 4);
			if(rnd == 2){
				return 'White';
			}
			else if (rnd == 3){
				return'Black';
			}
			else {
				return 0;
			}
		});
	});
}

}
// ^^ class Stadium ^^

// == Exports ==
module.exports = {
	stadium : new Stadium()
}
