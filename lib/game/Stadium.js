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
function applyMove(colour, move, game){ 


}
function validMove(move, game) {
	// Check that it is in order.
	if(move.Turn != game.Turn){
		return false;
	}
	// Check that it is inbounds
	if((move.Coord-x || move.Coord-y) >= game.BoardSize){
		return false;
	}
	// Check the spot is open
	if(game.Board[coord-x][coord-y] != 0){
		return false;
	}
}


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
function deleteGame() {

}














