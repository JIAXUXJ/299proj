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
		"whitePlayer": "Anon?",
		"blackPlayer": "Anon?",
		"WhiteCaptures": 7.5, //traditional handicap - violates schema def'n. (int)
		"BlackCaptures": 0,
		"State": "ACTIVE",
		"Turn": "Black",
	};
	
	//resolve White user account at create time
	db.getSessionById(gameObject.PWhiteID, function(data){
		if(!data){
			//no user account. it is a mysterious player without name.
			gameObject.whitePlayer = "Anon";
		} 
		else {
			gameObject.whitePlayer = data.userName;
		}
	});
	
	//resolve Black user account at create time
	db.getSessionById(gameObject.PBlackID, function(data){
		if(!data){
			//no user account. it is a mysterious player without name.
			gameObject.blackPlayer = "Anon";
		} 
		else {
			gameObject.blackPlayer = data.userName;
		}
	});
	
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
			logger.info('Stadium/getGame: passed ' + gid +', but was returned:\n\t' 
			+ data);
			cb(null);
		}
		else if (data._id != gid) {
			logger.info('Stadium/getGame: passed ' + gid +', but was returned '
				+ data._id);
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
	var self = this;
	
	//tag game as DONE with ending time
	gameObject.State = "DONE";
	gameObject.TimeEnd = new Date();
	
	//tally scores
	var scores = self._tally(gameObject.Board);
	gameObject.WhiteCaptures += scores.White;
	gameObject.BlackCaptures += scores.Black;
	
	//resolve White user account at endtime
	db.getSessionById(gameObject.PWhiteID, function(data){
		if(!data){
			//no user account. it was a mysterious player without name.
			gameObject.whitePlayer = "Anon";
		} else {
			gameObject.whitePlayer = data.userName;
		}
	});
	
	//resolve Black user account at endtime
	db.getSessionById(gameObject.PBlackID, function(data){
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
 * @param cb {function}: will be called on a success bool (true/false).
 */
newMove(gid, move, cb){
	var self = this;
	var writeData = {};
	
	//escaping the utter retardation of JQuery AJAX
	if(move.Pass == 'false'){
		move.Pass = false;
	}
	else if (move.Pass == 'true'){
		move.Pass = true;
	}
	move.CoordX = parseInt(move.CoordX);
	move.CoordY = parseInt(move.CoordY);
	
	if((move.Player != 'White') && (move.Player != 'Black')){
		logger.info("Stadium/newMove: bad player colour: "+ move.Player+"\n");
		cb(null);
		return;
	}
	
	db.getGameById(gid, function(data) {
		//If there's no game or a different game found, return null.
		if((!data) || data._id != gid) {
			logger.info("Stadium/newMove: bad data retrieval: "+ data+"\n");
			cb(null);
			return;
		}
		
		//If the game's finished, return the game state without doing anything.
		if (data.State == "DONE"){
			logger.info("Stadium/newMove: attempted write to finished game "
			+ data._id+"\n");
			cb(data);
			return;
		}
		
		//If both players pass then thassallshewrote
		if(data.moves.length > 0){
			if ((move.Pass) && (data.moves[data.moves.length - 1].Pass)){
				logger.info("Stadium/newMove: game is ending: "+ data._id+"\n");
				self.endGame(data, function(data){
					cb(data);
				});
				return;
			}
		}
		
		//If it's not a pass...	
		if(!move.Pass){
			//If the move is invalid, return without doing anything.
			if (!self._isValid(move, data, self)){
				logger.info("Stadium/newMove: invalid move: "+ data._id+"\n");
				cb(data);
				return;
			}
		
			//Finally, the move is valid, and so we may apply it.
			data.Board[move.CoordX][move.CoordY] = move.Player;
			var capture_response = self._capture(data.Board);
			
			//Update the board and scores...
			writeData.Board = capture_response.board;
			writeData.WhiteCaptures = data.WhiteCaptures + 
				capture_response.blackCaptured;
			writeData.BlackCaptures = data.BlackCaptures + 
				capture_response.whiteCaptured;
		}	else {
			logger.debug("Pass.\n");
		}
		if(data.Turn == "White"){
			writeData.Turn = "Black";
		} else {
			writeData.Turn = "White";
		}

		//And then, write all those things to Mongo.
		db.appendGameMoveById(gid, move, function(push_ok){
			if(!push_ok){
				cb(false);
				return;
			}
			db.updateGameById(gid, writeData, function(write_ok){
				cb(write_ok);
			});
		});
	});
}

// == Internal functions to Stadium.js ==
 
_isValid(move, gameObject, self){
	
	// Check move is in-bounds
	if((move.CoordX < 0) || (move.CoordX > gameObject.BoardSize)
	|| (move.CoordY < 0) || (move.CoordY > gameObject.BoardSize)){
		logger.info("move is OOB: " + move.CoordX + ", " + move.CoordY+"\n");
		return false;
	}
	
	// Check if move spot is already taken
	if(gameObject.Board[move.CoordX][move.CoordY] != 0){
		logger.info("space is occupied: " + move.CoordX + ", " + move.CoordY+"\n");
		return false;
	}
	
	// Check for Ko - i.e., one cannot make the same move twice in a row.
	var lastMove;
	for(var k = gameObject.moves.length - 1; k >= 0; k--){
		if(gameObject.moves[k].Player == move.Player){
			lastMove = gameObject.moves[k];
		}
	}
	if ((lastMove) && (lastMove.CoordX == move.CoordX) && (lastMove.CoordY == move.CoordY)){
		logger.info("move is in Ko: " + move.CoordX + ", " + move.CoordY+"\n");
		return false;
	}
	
	//Check for suicide moves - ones which would remove an army's liberties.
	if(self._liberties(gameObject.Board, move.Player, move.CoordX, move.CoordY).count 
		== 0){
	logger.info("move is suicidal: " + move.CoordX + ", " + move.CoordY+"\n");
		return false;
	}
	
	return true;
}

/* Determine the number of liberties open to an army, starting from a point
 * (x,y).
 */
_liberties(board, colour, x, y){

	//Fast deep object clone, look away
	var boardCopy = (JSON.parse(JSON.stringify(board)));
	boardCopy[x][y] = colour;
	var stack = [{"x":x, "y":y}];
	var liberties = 0;
	
	//out-of-bounds accesses return 'undefined' in JS, even in strict mode
	while(stack.length > 0){
		var curr = stack.pop();
		
		//already checked '!' tiles, don't push them back onto the stack.
		boardCopy[curr.x][curr.y] = '!';
		
		var neighbours = [{"x": curr.x-1, "y": curr.y}, 
											{"x": curr.x+1, "y": curr.y}, 
											{"x": curr.x, "y": curr.y-1}, 
											{"x": curr.x, "y": curr.y+1}];
											
		neighbours.map(function(elem){
			if((typeof boardCopy[elem.x] == 'undefined') 
			|| (typeof boardCopy[elem.x][elem.y] == 'undefined')){
				return;
			}
			else {
				//push unmarked, same-colour pieces to stack.	
				if (boardCopy[elem.x][elem.y] == colour){
					stack.push(elem);
				}
				//count and remove liberties (to prevent double-counting).
				else if (boardCopy[elem.x][elem.y] == 0){
					liberties += 1;
					boardCopy[elem.x][elem.y] = 'L';
				}
			}
		});		
	}
	//console.log(boardCopy);
	return {"board": boardCopy, "count": liberties};
}

/* Determine any captured armies, and remove them, returning the B/W capture
 * count.
 * This runs somewhere under O(N^4) time, where N is the board size.
 * I say this as I think the O(N^4) case is not reachable. 
 * Anyway, it should usually mean constant time, but still, use sparingly.
 */
_capture(board){
	var bCaps = 0;
	var wCaps = 0;
	
	//for every space in the board... (could have used two maps here)
	for(var i = 0; i < board.length; i++){
		for(var j = 0; j < board.length; j++){
		
			//if the space is nonzero...
			if(board[i][j] != 0){
				//...determine whether that space's army was captured.
				var who = board[i][j];
				var res = this._liberties(board, board[i][j], i, j);
				var count = 0;
				var rep;
				var inc;
				//rep is what we will replace the marked army ('!' spaces) with.
				if(res.count == 0){
					rep = 0;
				}
				else {
					rep = who;
				}
				
				//map the marked army back to normal, or delete it.
				//also, unmark liberties ('L').
				board = res.board.map(function(row){
					return row.map(function(elem){
						if(elem == 'L'){ 
							return 0; 
						}
						else if (elem == '!') { 
							if(rep == 0){
								count += 1;
							}
							
							return rep; 
						}
						else { 
							return elem; 
						}
					});
				});
				//console.log('count:'+count+' on '+who);
				
				//finally, add any captures to the score increase for each player.
				if(who == 'White'){
					wCaps += count;
				} 
				else {
					bCaps += count;
				}
			}
		}
	}
	return {"board": board, "blackCaptured": bCaps, "whiteCaptured": wCaps};
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
var stadInst = new Stadium();
module.exports = stadInst;
