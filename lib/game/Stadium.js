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
function applyMove(move, gameID){
	var g = getGameById(gameID);
	// validMove test
	if(!validMove(move, game)){
		throw new Error('Invalid move!');
	}
	
	if(move.pass && move.Turn == game.Turn){
		
			
	}

	
	
	
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














