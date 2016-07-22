/* 
 * Implements the Stadium class.
 * The idea here is to be able to add moves and stuff.
 *
 * Tyler Harnadek
 */

//imports
    //express
    //auth/auth.js
	var uuid   = require('node-uuid');
	var db     = require('../db/MongoDB.js');
	var logger = require('../util/logger.js');
	
//constants
	const MOVE_CALLBACK_OK = 'OK';

/*
 * Builds a game, assigns a UUID, and stores it in the database.
 * 
 * @param blackID {string} The id number of the black player.
 * @param whiteID {string} The id number of the white player.
 * @param size {int} The desired board size.
 * @param cb {function} A callback function on the success of the operation.
 *		Takes a boolean value, `true` for success and `false` for failure.
 */

function newGame(blackID, whiteID, size, cb){
	var id = uuid.v4();
	var d = new Date();
	var b = newBoard(size);
	var g = {
		"_id":id,
		"TimeStart":d,
		"TimeEnd":d,
		"BoardSize": size,
		"Board": b,
		"moves": [],
		"PWhiteID": whiteID,
		"PBlackID": blackID,
		"WhiteCaptures":0,
		"BlackCaptures":0,
		"State": "active",
		"Turn": "Black",
		"Pass": "false",
		};
	db.newGame(g, function(insId){
		if(!insId){
			cb(null);
		} else if (insId != id) {
			logger.warning('ID mismatch on creating new game: passed ' + id +', but was returned ' + data._id);
			cb(null);
		} else {
			logger.debug(id);
			cb(id);
		}
	});
	// Callback 'g' ??
}

function getGame(gameID, cb){
	db.getGameById(gameID, function(data){
		if(!data){
			cb(null);
		} else if (data._id != gameID) {
			logger.warn('ID mismatch on retrieving game: passed ' + gameID +', but was returned ' + data._id);
			cb(null);
		} else {
			cb(data);
		}
	});
}
	
/*
 * Adds a move to a game based upon UUID
 * 
 * @param gameID {UUID} The id of the desired game.
 * @param move {object} The move that you wish to apply. Based upon Move.JSON
 * @param cb {function} A callback function on the success of the operation.
 *		Takes a message string: 'OK' for success, and an explanation for the
 *		move's failure otherwise.
 *      
 */
	
function newMove(gameID, move, cb){
	db.getGameById(gameID, function(data){
		if (data){
			// validMove test
			if((data.State != "ACTIVE") && (data.State != "active")){
				cb('Game is inactive!');
				return;
			}
			// First, check if it's a pass
			if(move.pass){
				if(data.Pass == 'True'){
					endGame(game);
					}
				else{
					applyMove(move.Player, move, data, function(apply_ok){
						if (apply_ok){
							cb('OK');
						} else {
							cb('Bad application of move.');
						}
					});
				}
			}
			// Check if the move is valid
			if(!validMove(move, data)){
				cb('Invalid move!');
				return;
			}
			// update the board
			updateBoard(move, data);
			applyMove(move.Player, move, data, function(apply_ok){
				if (apply_ok){
					cb('OK');
				} else {
					cb('Bad application of move.');
				}
			});
		} else {
			cb('Game not found!');
		}
	});
}

// Edits the game object to reflect that this move has been played
function applyMove(colour, move, game, cb){ 
	// adds the move to the registry of moves
	game.moves.push(move);
	if(colour == 'Black'){
		game.Turn = 'White';
	}
	else{
		game.Turn = 'Black';
	}
	
	db.updateGameById(game._id, move, function(update_good){
		cb(update_good);
	});
}

//checks the validity of a given move
function validMove(move, game) {
	// Check that it is in order.
	if(move.Turn != game.Turn){
		console.log('Out of turn.');
		return false;
	}
	// Check that it is inbounds
	if(!inbounds(move.CoordX, move.CoordY, game)){
		console.log('Out of bounds.');
		return false;
	}
	// Check the spot is open
	if(game.Board[move.CoordX][move.CoordY] != 0){
		console.log('Spot already taken by: ' + game.Board[move.CoordX][move.CoordY]);
		return false;
	}
	// Check for Ko
	for(var k = game.moves.length-1; k>=0;k--){
		// Find the last move by this player
		if(game.moves[k].Player == move.Player){
			if(game.moves[k].CoordX == move.CoordX && game.moves[k].CoordY == move.CoordY){
				console.log('Move in Ko.');
				return false;
			}
			k = -1;
		}
	}
	// Check that there is at least 1 liberty
	if(!liberties(move.CoordX, move.CoordY, move.Player, game, newBoard(game.BoardSize))){
		console.log('Move is suicide.');
		return false;
	}
	
	return true;
}

// updates the board
function updateBoard(move, game){
	var x = move.CoordX;
	var y = move.CoordY;
	var c = move.Player;
	// We already checked that we can place this here so let's just go ahead and drop it
	game.board[x][y] = c;
	
	// Check all of the adjacent squares - if they have no liberties, remove them
	if(!liberties(move.CoordX+1, move.CoordY, move.Player, game, newBoard(game.BoardSize))){
		removeArmy(CoordX+1, CoordY, game);
	}
	if(!liberties(move.CoordX, move.CoordY+1, move.Player, game, newBoard(game.BoardSize))){
		removeArmy(CoordX, CoordY+1, game);
	}	
	if(!liberties(move.CoordX-1, move.CoordY, move.Player, game, newBoard(game.BoardSize))){
		removeArmy(CoordX-1, CoordY, game);
	}
	if(!liberties(move.CoordX, move.CoordY-1, move.Player, game, newBoard(game.BoardSize))){
		removeArmy(CoordX, CoordY-1, move.Player, game);
	}	
	
	
// recursive function liberty returns true if an army has at least one liberty, or false if it does not have a liberty
}
function liberties(x, y, colour, game, checkBoard){
	// checkBoard keeps track of what we've alreaqdy checked
	checkBoard[x][y] = 1;
	//check right
	if(inbounds(x+1, y) && checkBoard[x+1][y] == 0){
		if(game.Board[x+1][y] == 0){
			return true;
		}else if(game.Board[x+1][y] == colour){
			return liberties(x+1, y, colour, game, checkBoard);
		}
	}
	//check left
	if(inbounds(x-1, y) && checkBoard[x-1][y] == 0){	
		if(game.Board[x-1][y] == 0){
			return true;
		}else if(game.Board[x-1][y] == colour){
			return liberties(x-1, y, colour, game, checkBoard);
		}
	}
	//check above
	if(inbounds(x, y+1) && checkBoard[x][y+1] == 0){
		if(game.Board[x][y+1] == 0){
			return true;
		}else if(game.Board[x][y+1] == colour){
			return liberties(x, y+1, colour, game, checkBoard);
		}
	}
	//check below
	if(inbounds(x, y-1) && checkBoard[x][y-1] == 0){
		if(game.Board[x][y-1] == 0){
			return true;
		}else if(game.Board[x][y-1] == colour){
			return liberties(x, y-1, colour, game, checkBoard);
		}
	}
	// Nothing else returned true (no liberties found) so we return false 
	return false;

}
function inbounds(x,y, game){
	if(x<0 || x >= game.BoardSize || y<0 || y>=game.BoardSize){
		return false;
	}else{
	return true;
	}
}

// removeArmy sets every piece inside of an army to 0, or empty
function removeArmy(x, y, game){
	// This part removes the stone at our current location.
	var colour = game.Board[x][y];
	game.Board[x][y] = 0;
	var m = {
		"game":game.id,
		"CoordX": x,
		"CoordY": y,
		"pass": false,
		"player": controller,
		"type": "remove"
	}
	game.moves.push(m);
	if(colour == "White"){
		game.BlackCaptures = game.BlackCaptures + 1;
	}
	else{
		game.WhiteCaptures = game.WhiteCaptures + 1;
	}

	// This part triggers recursion
	if(inbounds(x+1, y, game)){
		if(game.Board[x+1][y] == colour){
			removeArmy(x+1, y, game);
		}
	}
	if(inbounds(x-1, y, game)){
		if(game.Board[x-1][y] == colour){
			removeArmy(x-1, y, game);
		}
	}
	if(inbounds(x, y+1, game)){
		if(game.Board[x][y+1] == colour){
			removeArmy(x, y+1, game);
		}
	}
	if(inbounds(x, y-1, game)){
		if(game.Board[x][y-1] == colour){
			removeArmy(x, y-1, game);
		}	
	}
}
// creates a new gameboard
function newBoard(size){
	var board = new Array();
	for(var i = 0; i < size; i++){
		board[i] = new Array();
		for(var j = 0; j < size; j++){
			board[i][j] = 0;
		}	
	}
	return board;
}
function getScore(game, colour){
	var score = 0;
	for(var i = 0; i < game.BoardSize; i++){
		for(var j = 0; j < game.BoardSize; j++){
			if(game.Board[i][j] == colour){
				score = score + 1;
			}
		}
	}
	if(colour = "White"){
		score = score + game.WhiteCaptures;
	}
	else{
		score = score + game.BlackCaptures;
	}
	return score;
}
function endGame(game, cb){
	var WhiteScore = getScore(game, "White");
	var BlackScore = getScore(game, "Black");
	var whitePlayer = getSessionById(game.PWhiteID);
	var blackPlayer = getSessionById(game.PBlackID);
	/*
	game.State = "done";
	game.PWhiteID = whitePlayer;
	game.PBlackID = blackPlayer;
	game.TimeEnd = new Date();
	*/
	var data = {
		"WhiteCaptures": WhiteScore,
		"BlackCaptures": BlackScore,
		"PWhiteID": whitePlayer,
		"PBlackID": blackPlayer,
		"State": "DONE",
		"TimeEnd": new Date(),
	};
	db.updateGameById(game, data, cb);	// I think we can do this as we expect a boolean to be passed for both CBs
}
// deletes a game from the database
function deleteGame(game) {
	// NOT IMPLEMENTED
	
	
	// Callback - What do I need to call back here?
}

module.exports = {
	newGame : newGame,
	getGame : getGame,
	newMove : newMove,
	applyMove : applyMove,
	validMove : validMove,
	updateBoard : updateBoard,
	liberties : liberties,
	inbounds : inbounds,
	removeArmy : removeArmy,
	newBoard : newBoard,
	getScore : getScore,
	endGame : endGame
}
