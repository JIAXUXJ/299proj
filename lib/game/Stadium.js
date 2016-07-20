/* 
 * Implements the Stadium class.
 * The idea here is to be able to add moves and stuff.
 *
 * Tyler Harnadek
 */

//imports
    //express
    //auth/auth.js
	var uuid = require('node-uuid');
	var db  = require('../db/DBInterface.js');
	
//constants



function newGame(blackID, whiteID, size){
	var id = uuid.v4();
	var d = new Date();
	var b = newBoard(size);
	var g = {
		"gameID":id,
		"TimeStart":d,
		"TimeEnd":d,
		"BoardSize": size,
		"Board": b,
		"moves": [],
		"PWhiteID": whiteID,
		"PBlackID": blackID,
		"State": "active",
		"Turn": "Black",
		"Pass": "false"
		};
	db.newGame(g);
	// Callback 'g' ??
	}
	
}
function newMove(move, gameID){
	var g = getGameById(gameID);
	// validMove test
	if(g.State != "active"){
		throw new Error('Game is inactive!');
	}
	// First, check if it's a pass
	if(move.pass){
		if((move.turn == 'Black') && g.Pass){
			applyMove('Black', move, g);
		}
		if((move.turn == 'White') && g.Pass){
			applyMove('White', move, g);
		}
		if(g.Pass){
			endGame();
		}
		else{
			g.Pass = true
		}
	}
	// Check if the move is valid
	if(!validMove(move, game)){
		throw new Error('Invalid move!');
	}

}

// Edits the game object to reflect that this move has been played
function applyMove(colour, move, game){ 
	// adds the move to the registry of moves
	game.moves.push(move);
	if(colour == 'Black'){
		game.Turn = 'White';
	}
	else{
		game.Turn = 'Black';
	}
	

}

//checks the validity of a given move
function validMove(move, game) {
	// Check that it is in order.
	if(move.Turn != game.Turn){
		return false;
	}
	// Check that it is inbounds
	if(((move.CoordX || move.CoordY) >= game.BoardSize) && ((move.CoordX || move.CoordY) >= 0)){
		return false;
	}
	// Check the spot is open
	if(game.Board[CoordX][CoordY] != 0){
		return false;
	}
	// Check for Ko
	for(var k = game.moves.length-1; k>=0;k--){
		// Find the last move by this player
		if(game.moves[k].turn == move.turn){
			if(game.moves[k].CoordX == move.CoordX && game.moves[k].CoordY == move.CoordY){
				return false;
			}
			k = -1;
		}
	}
	// Check that there is at least 1 liberty
	if(!liberties(move.CoordX, move.CoordY, move.Turn, game, newBoard(game.BoardSize){
		return false;
	}
}

// updates the board
function updateBoard(move, game){
	var x = move.CoordX;
	var y = move.CoordY;
	var c = move.turn;
	// We already checked that we can place this here so let's just go ahead and drop it
	game.board[x][y] = c;
	if(
	
// checkBoard is a boolean board to keep track of what we've already checked. It starts as an array of 0's.
}
function liberties(x, y, colour, game, checkBoard){
	if()	
		if(game.Board[x+1][y] == 0){
			return true;
		}else{
			return liberties(x, y, colour, game, checkBoard);
		}

}
function removeArmy(x, y, colour, game){


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
	return f;
}
// deletes a game from the database
function deleteGame() {

}














