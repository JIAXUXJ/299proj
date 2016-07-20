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
		"Turn": "Black"
		};
	db.newGame(g);
	}
	
}
function newMove(move, gameID){
	var g = getGameById(gameID);
	// validMove test
	if(!validMove(move, game)){
		throw new Error('Invalid move!');
	}
	if(move.pass){
		if((move.turn == 'Black') && (g.moves[g.moves.length-1].pass != true)){
			applyMove();
		}
		if((move.turn == 'White') && (g.moves[g.moves.length-1].pass != true)){
			applyMove();
		}
	}
}
function applyMove(){


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














