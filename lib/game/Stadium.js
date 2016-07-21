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
		"WhiteCaptures":0,
		"BlackCaptures":0,
		"State": "active",
		"Turn": "Black",
		"Pass": "false"
		};
	db.newGame(g);
	// Callback 'g' ??
	}
	
function newMove(move, gameID){
	var g = getGameById(gameID);
	// validMove test
	if(g.State != "active"){
		throw new Error('Game is inactive!');
	}
	// First, check if it's a pass
	if(move.pass){
		if((move.Player == 'Black') && g.Pass){
			applyMove('Black', move, g);
		}
		if((move.Player == 'White') && g.Pass){
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
	if(move.Player != game.Turn){
		return false;
	}
	// Check that it is inbounds
	if(!inbounds(move.CoordX, move.CoordY, game)){
		return false;
	}
	// Check the spot is open
	if(game.Board[CoordX][CoordY] != 0){
		return false;
	}
	// Check for Ko
	for(var k = game.moves.length-1; k>=0;k--){
		// Find the last move by this player
		if(game.moves[k].Player == move.Player){
			if(game.moves[k].CoordX == move.CoordX && game.moves[k].CoordY == move.CoordY){
				return false;
			}
			k = -1;
		}
	}
	// Check that there is at least 1 liberty
	if(!liberties(move.CoordX, move.CoordY, move.Player, game, newBoard(game.BoardSize))){
		return false;
	}
}

// updates the board
function updateBoard(move, game){
	var x = move.CoordX;
	var y = move.CoordY;
	var c = move.Player;
	// We already checked that we can place this here so let's just go ahead and drop it
	game.board[x][y] = c;
	
	// Check all of the adjacent squares - if they have no liberties, remove them
	if(!liberties(x+1, y, c, game, newBoard(game.BoardSize))){
		removeArmy(x+1, y, c, game);
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
function removeArmy(x, y, colour, game){
	
	// This part removes the stone at our current location.
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
	if(inbounds(x+1, y, game){
		if(game.Board[x+1][y] == colour){
			removeArmy(game.Board[x+1][y]);
		}
	}
	if(inbounds(x-1, y, game){
		if(game.Board[x-1][y] == colour){
			removeArmy(game.Board[x+1][y]);
		}
	}
	if(inbounds(x, y+1, game){
		if(game.Board[x][y+1] == colour){
			removeArmy(game.Board[x+1][y]);
		}
	}
	if(inbounds(x, y-1, game){
		if(game.Board[x][y-1] == colour){
			removeArmy(game.Board[x+1][y]);
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
	return f;
}
// deletes a game from the database
function deleteGame() {

}














