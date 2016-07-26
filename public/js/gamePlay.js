/**
 * Created by Joye on 2016-07-20.
 */

// globals
var params = null;
var gameID = null;
var boardSize = null;
var canvasSize = null;
var mode = null;
var turn = 'Black';
var socket = io.connect('http://localhost:30052');

/**
 * Requests a new board state from the server's /data route.
 * @param cb {function} callback to call when the request comes back from the server.
 *      - Takes a "data" parameter, which will be passed the information from the
 *        GET request.
 */
function getData(cb) {
    console.log("GameID: " + gameID);
    if(gameID){
        $.ajax({
            url: "/game/"+gameID,
            success: function(data){
                //$("#result").text(JSON.stringify(data));
               	console.log('emitting observe event for gid '+gameID);
								socket.emit('observe', {'gid': gameID});
                cb(data);
            },
            dataType: "json"});
    }

    // $.get("/game", function(data, textStatus, xhr){
    //     console.log("Response for /data: "+textStatus);
    //     console.log("data: ", data)
    //     // handle any errors here....
    //
    //     // draw the board....
    //     cb(data);
    //
    // });
}

/**
 * Updates the board, capture count and turn on the screen according to
 * data returned from the server.
 *
 * @param data {Object} Data returned from a GET request to the server on
 *                      /game/:gid
 */
function updateGame(data) {

    // update the board state
    drawBoard(data.Board);

    // update capture count
    $("#p1-captures").empty().html(data.BlackCaptures);
    $("#p2-captures").empty().html(data.WhiteCaptures);

    // update turn
    turn = data.Turn;
    $("#p1-pass").css("visibility", turn == "Black" ? "visible" : "hidden");
    $("#p2-pass").css("visibility", turn == "White" ? "visible" : "hidden");
    //alert("It's " + data.Turn + "'s turn!");
}

/*
 * Parses the URL's parameters and returns them as a set of
 * key/value pairs.
 */
function parseUrl() {
    var url = location.href;
    var k = url.indexOf('?');
    if(k == -1){
        return;
    }
    var querystr = url.substr(k+1);
    var arr1 = querystr.split('&');
    var arr2 = new Object();
    for (k in arr1){
        var ta = arr1[k].split('=');
        arr2[ta[0]] = ta[1];
    }
    return arr2;
}

/*
 * Draws the board given a certain board state.
 * @param state {int[][]} 2-D array representing the state of the board
 */
function drawBoard(state) {

	// Descriptively name the canvas
    var canvas = $('#canvas-board');
    canvasSize = 600;
	// Calculate the line offset - I actually don't know how this arithmetic works but it draws a nice board so ¯\_(ツ)_/¯
	var offset = 10 * Math.floor(canvasSize / (boardSize+1));
	console.log(offset);
    var svg = $(makeSVG(canvasSize, canvasSize));

    /* Removed the background checkerboard colours option because if I can't have fun nobody can. */
    /*
    var bgcolor1, bgcolor2;
    if(bg.length === 4){
        bgcolor1 = bg[2];
        bgcolor2 = bg[3];
        console.log(bgcolor1, bgcolor2)
    }else {
        bgcolor1 = bgcolor2 = bg[2];
    }
    */
	
	// We could modify this to do colour, or we could go Web2.0 Monotone. 
    //draw every unit rectangle
    /* var isOdd = false;
    for(i = offset; i < squareSize - offset*2; i+=unitSize){
        for(j = offset; j < squareSize - offset*2; j+=unitSize ){
            //if-else comment: make the color different in the different unit.
                svg.append($(makeRectangle(i, j, unitSize, unitSize, 'slategrey')));

        }
    } */
	// Solid Colour Background for those of us who like to pretend we know what web design is.
	svg.append($(makeRectangle(0, 0, canvasSize, canvasSize, 'slategrey')));
	
	
	// Draw the lines on the board
	// update 3.6: lines have been trained to maintain perfect straightness at all times, including when under duress.
	var k = offset;
    for(var i = 0; i < boardSize; i++){
        svg.append(makeLine(k, 0, k, canvasSize));
		k += offset;
	}
	k = offset;
    for(var i = 0; i < boardSize; i++){
        svg.append(makeLine(0, k, canvasSize, k));
		k += offset;
	}

     // TODO : only thing need to be change when data refreshed from server
    for(var i = 0; i < boardSize; i++){
        for (var j = 0; j < boardSize; j ++){
            // svg.append(makeCircle(i*unitSize + unitSize, j*unitSize + unitSize, unitSize/2.5, 'rgba(255, 255, 255, 0)'));
            if(state[i][j] == 'Black'){
                svg.append(makeCircle(i*offset+offset, j*offset+offset, offset/2.5, 'rgba(1, 1, 1, 1)'));//black
            }else if(state[i][j] == 'White'){
                svg.append(makeCircle(i*offset+offset, j*offset+offset, offset/2.5, 'rgba(255, 255, 255, 1)'));//white
            }else{
                svg.append(makeCircle(i*offset+offset, j*offset+offset, offset/2.5, 'rgba(255, 255, 255, 0)'));// invisible ink
            }
        }
    } 
	
	
	// Big fan of this next line - hot take to do it all at once
    canvas.empty().append(svg);
	// once more return to our master and wait for orders
    gamePlay();
}

/*
 * Adds a click event handler for the canvas.
 */
function gamePlay(){

    $('circle').on('click', function () {
        console.log("Board Size: ", boardSize);
		var offset = 10 * Math.floor(canvasSize / (boardSize+1));
        
		// Calculate the integer location of this stone
		var CoorX = ($(this)[0].attributes.cx.nodeValue - offset)/offset;
        var CoorY = ($(this)[0].attributes.cy.nodeValue - offset)/offset;
        // round even though we shouldn't have to (everyone loves round numbers)
		// The server also taps out if you send a floating point number
		CoorX = Math.round(CoorX);
		CoorY = Math.round(CoorY);
        console.log("Making move: (" + CoorX + ", " + CoorY + ")");
		// Post the move data to the server
		// If you bring a box of timbits they'll serve you quicker
        $.post(
            "/game/" + gameID,
            {
                "Game": gameID,
                "CoordX": CoorX,
                "CoordY": CoorY,
								"Pass": 'false',
                "Player" : turn
            },
            function (data, textStatus){
				      if (textStatus !== 'success') {
				        alert("Failed to send move to server");
				        console.log("Move failed. Status: " + textStatus);
				      }
				      else {
								socket.emit('game-updated', {'gid': gameID});
				      }
            }
        );
		getData(updateGame);

    });
	// Get the nice finger-pointy thing because everyone loves those
    $('#canvas-board').on('mouseover', function () {
        // location.href = "./img/black.ani";
        // $(this)[0].style.cursor = url('./img/black.ani');
        $(this)[0].style.cursor = 'pointer';
    });

}

function passToken() {
    $(".pass-button").click(function() {

        $.post(
            "/game/" + gameID,
            {
                "game": gameID,
                "Pass": 'true',
                "Turn": turn
            }, function(data, textStatus) {
                if (textStatus !== 'success') {
                  alert('Failed to send move to server.');
                  console.log("Move failed. Status: " + textStatus);
                }
                else {
                	socket.emit('game-updated', {'gid': gameID});
                }
            }
        );
		//getData(updateGame);
    });
}
function init() {

    console.log("Initalizing Page...");

    // parse url and get parameters
    params = parseUrl();
    gameID = params.gameID;
    boardSize = params.size;
    mode = params.mode;

    // init event handlers
    gamePlay();
    passToken();

    // get initial board state
    getData(updateGame);
    //gamePlay func can return the position of circle.

}

init();

socket.on('observe-prompt', function(data){
	console.log('emitting observe event for gid '+data);
	socket.emit('observe', {'gid': data});
});

socket.on('game-new-data', function(data){
	console.log('game updated by push event: '+data);
	updateGame(data);
});
