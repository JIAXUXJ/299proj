/**
 * Main gameplay script
 * Run Socket.io and JQuery scripts before using this!
 *
 * Created by Joye on 2016-07-15.
 */
/**
 * Requests a new board state from the server's /data route.
 */

//board size, in pixels
const BOARD_SIZE = 500;

//board state
var boardState = null;
var gameID = null;

function getData(){

    gameID = window.location.href.split("?gameID=")[1];
    console.log(gameID);

    $.get("/game/" + gameID, function(data, textStatus, xhr){
        console.log("Response for /data: "+textStatus);
        console.log("data: ", data);

        //subscribe to socket.io updates
        var socket = io();
        socket.emit('observe-register', gameID);
        //respond to game board updates?

        // draw initial board state
        boardState = data.Board;
        drawBoard(boardState);
    });
}
/**
 * Draws the board to the #canvas element on the page.
 * @param state {object} - a 2-D array representing the state of the board
 *      - 0 represents an empty square
 *      - 1 represents a BLACK army on the square
 *      - 2 represents a WHITE army on the square
 */
function drawBoard(state){
    // everything else should adapt to an adjustable
    // height and width.
    console.log("Board Size: ", state.length);
    var numSquares = state.length;

    var canvas = $("#canvas-board");
    canvas.css("height", BOARD_SIZE );
    canvas.css("width", BOARD_SIZE );

    // Change the height and width of the board here...
    // The actual SVG element to add to.
    // we make a jQuery object out of this, so that
    // we can manipulate it via calls to the jQuery API.
    var svg = $(makeSVG(BOARD_SIZE, BOARD_SIZE));
    var squareSize = BOARD_SIZE/numSquares;
    var temp = 0;

    //draw every unit rectangle
    for (var y = 0; y < BOARD_SIZE; y += squareSize) {
        for (var x = 0; x < BOARD_SIZE; x += squareSize) {
            svg.append(makeRectangle(x, y, squareSize, squareSize, "#B8BDBD"));
        }
    }

    //draw lines
    for (var i = 0; i < BOARD_SIZE; i += squareSize) {
        //vertical line
        svg.append(makeLine(i, 0, i, BOARD_SIZE, "#000000"));
        //horizontal line
        svg.append(makeLine(0, i, BOARD_SIZE, i, "#000000"));
    }

    // draw armies on the board
    for (var x1 = 0; x1 < state.length; x1++) {
        for (var y1 = 0; y1 < state.length; y1++) {

            // black armies
            if (state[y1][x1] == 1) {
                svg.append(makeCircle(x1 * squareSize, y1 * squareSize, squareSize, "#000000"));
            }
            //white armies
            else if (state[y1][x1] == 2) {
                svg.append(makeCircle(x1 * squareSize, y1 * squareSize, squareSize, "#FFFFFF"));
            }

        }
    }

    canvas.append(svg);
}

function init(){
    // do page load things here...
    console.log("Initalizing Page....");
    getData(drawBoard);

    //register board click event
    $('#canvas-board').on('click', function (e) {
        // var bg = window.location.search;
        //
        // bg = bg.substring(bg.indexOf('?')+1, bg.length);
        // var bg = bg.split(";");
        //
        // var size = bg[1];
        // var unitSize;
        // if(size <= 10){
        //     unitSize = 105.55555;
        // }else if(size > 10 && size <= 15){
        //     unitSize = 73;
        // }else {
        //     unitSize = 50;
        // }
        //
        // var svg = $(makeSVG(unitSize/2.5, unitSize/2.5));
        // svg.append(makeCircleCursor(unitSize/2.5, 'black'));
        // TODO get .ico pic as cursor.


        //get the square the user clicked on
        var rect = this.getBoundingClientRect();
        var CoorX = Math.floor((e.clientX - rect.left) / (BOARD_SIZE / boardState.length));
        var CoorY = Math.floor((e.clientY - rect.top) / (BOARD_SIZE / boardState.length));


        console.log("Making move: (" + CoorX + ", " + CoorY + ")");

        $.post("/game/" + gameID,
            {
                CoordX: CoorX,
                CoordY: CoorY,
                color: "black", //not sure how to determine my color here....
                pass: false,
                game: gameID,
            }, function(data, textStatus) {
                if (textStatus !== 'success') {
                    alert("Failed to send move to server");
                    console.log("Move failed. Status: " + textStatus);
                }
            });

    });
}


init();
