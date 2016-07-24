/**
 * Created by Joye on 2016-07-20.
 */

// globals
var params = null;
var gameID = null;
var boardSize = null;
var mode = null;
var turn = 'Black';

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
                console.log(data);
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
    alert("It's " + data.Turn + "'s turn!");
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
    //bg is a string passed from user setting page, it is a string look like:
    // token-color; bg-color; size

    var canvas = $('#canvas-board');
    var squareSize = 500;
    var offset = Math.floor((squareSize % boardSize) / 2);
    var unitSize = Math.floor(squareSize / boardSize);

    var svg = $(makeSVG(squareSize, squareSize));

    /* BOARD COLORS */
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

    //draw every unit rectangle
    var isOdd = false;
    for(i = offset; i < squareSize - offset*2; i+=unitSize){
        for(j = offset; j < squareSize - offset*2; j+=unitSize ){
            //if-else comment: make the color different in the different unit.
            if(isOdd){
                svg.append($(makeRectangle(i, j, unitSize, unitSize, '#FF0000')));
            }else {
                svg.append($(makeRectangle(i, j, unitSize, unitSize, '#00FF00')));
            }
            isOdd = !isOdd;
        }
    }

    for(var k = unitSize + offset; k < squareSize; k+=unitSize){
        svg.append(makeLine(k, 0, k, squareSize));
    }

    for(var a = unitSize + offset; a < squareSize; a+=unitSize){
        svg.append(makeLine(0, a, squareSize, a));
    }

    // TODO : only thing need to be change when data refreshed from server
    for(var i = 0; i < boardSize; i++){
        for (var j = 0; j < boardSize; j ++){
            // svg.append(makeCircle(i*unitSize + unitSize, j*unitSize + unitSize, unitSize/2.5, 'rgba(255, 255, 255, 0)'));
            if(state[i][j] == 'BLACK'){
                svg.append(makeCircle(i*unitSize + unitSize, j*unitSize + unitSize, unitSize/2.5, 'rgba(1, 1, 1, 1)'));//black
            }else if(state[i][j] == 'WHITE'){
                svg.append(makeCircle(i*unitSize + unitSize, j*unitSize + unitSize, unitSize/2.5, 'rgba(255, 255, 255, 1)'));//white
            }else{
                svg.append(makeCircle(i*unitSize + unitSize, j*unitSize + unitSize, unitSize/2.5, 'rgba(255, 255, 255, 0)'));// invisible ink
            }
        }
    }
	// Big fan of this next line - hot take to do it all at once - Tharnadek
    canvas.empty().append(svg);
    gamePlay();
}

/*
 * Adds a click event handler for the canvas.
 */
function gamePlay(){
    $('circle').on('click', function () {
        console.log("Board Size: ", boardSize);
        var size = boardSize;
        var unitSize;
        if(size <= 10){
            unitSize = 64;//105.55555
        }else if(size > 10 && size <= 15){
            unitSize = 44;//73
        }else {
            unitSize = 30;//50 origin
        }
        var CoorX = ($(this)[0].attributes.cx.nodeValue - unitSize)/unitSize;
        var CoorY = ($(this)[0].attributes.cy.nodeValue - unitSize)/unitSize;
        CoorX = Math.round(CoorX);
		CoorY = Math.round(CoorY);
        console.log("Making move: (" + CoorX + ", " + CoorY + ")");
        // TODO write sth here: to check if it is a valid move, if yes, user can place token here.
        //TODO: I'm note faimiliar with server code, so I don't know how to send data to server here
        //TODO: all things should be write below here, donot change any other JS code in this file.

        $.post(
            "/game/" + gameID,
            {
                "Game": gameID,
                "CoordX": CoorX,
                "CoordY": CoorY,
				"Pass": 'false',
                "Player" : turn
            },function (data, textStatus){
                if (textStatus !== 'success') {
                    alert("Failed to send move to server");
                    console.log("Move failed. Status: " + textStatus);
                }
            }
        );


    });

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
            }
        );

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