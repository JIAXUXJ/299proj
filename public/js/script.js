/**
 * Main gameplay script
 * Run Socket.io and JQuery scripts before using this!
 *
 * Created by Joye on 2016-07-15.
 */
/**
 * Requests a new board state from the server's /data route.
 */
function getData(){

    gameID = window.location.href.split("?gameID=")[-1];

    $.get("/game/" + gameID, function(data, textStatus, xhr){
        console.log("Response for /data: "+textStatus);
        console.log("data: ", data);

        //subscribe to socket.io updates
        var socket = io();
        socket.emit('observe-register', gameID);
        //respond to game board updates?

        // draw initial board state
        drawBoard(data.Board);
    });
}
/**
 * Draws the board to the #canvas element on the page.
 * @param state {object} - an object representing the state of the board.
 */
function drawBoard(state){
    // everything else should adapt to an adjustable
    // height and width.
    console.log("Board Size: ", state.size);
    var unitSize;
    if(state.size <= 10){
        unitSize = 100;
    }else if(state.size > 10 && state.size <= 15){
        unitSize = 70;
    }else {
        unitSize = 50;
    }
    var canvas = $("#canvas-board");
    var W = state.size * unitSize + unitSize, H = state.size * unitSize + unitSize;
    canvas.css("height", H );
    canvas.css("width", W );

    // Change the height and width of the board here...
    // The actual SVG element to add to.
    // we make a jQuery object out of this, so that
    // we can manipulate it via calls to the jQuery API.
    var svg = $(makeSVG(W, H));
    var i, j;
    var temp = 0;

    //draw every unit rectangle
    for(i = 0; i <= W; i+=unitSize){
        for(j = 0; j <= H; j+=unitSize ){
            //if-else comment: make the color different in the different unit.
            if((i/unitSize)%2 == 0 && (j/unitSize)%2 == 0 || (i/unitSize)%2 == 1 && (j/unitSize)%2 == 1){
                svg.append($(makeRectangle(i, j, unitSize, unitSize, 'burlywood')));
            }else {
                svg.append($(makeRectangle(i, j, unitSize, unitSize, 'darkkhaki')));
            }
        }
    }

    for(var k = unitSize; k < W; k+=unitSize){
        svg.append(makeLine(k, 1, k, W-1));
    }

    for(var a = unitSize; a < H; a+=unitSize){
        svg.append(makeLine(1, a, H-1, a));
    }

    // append the svg object to the canvas object.
    var board = state.board[0];

    for(var i = 0; i < state.size; i++){
        for (var j = 0; j < state.size; j ++){
            if(state.board[i][j] == 1){
                svg.append(makeCircle(i*unitSize + unitSize, j*unitSize + unitSize, unitSize/2.5, 'balck'));
            }else if(state.board[i][j] == 2){
                svg.append(makeCircle(i*unitSize + unitSize, j*unitSize + unitSize, unitSize/2.5, 'white'));
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
    $('circle').on('click', function () {
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
        $(this)[0].style.cursor = "pointer";



        var bg = window.location.search;
        bg = bg.substring(bg.indexOf('?')+1, bg.length);
        var bg = bg.split(";");

        console.log("Board Size: ", bg[1]);
        var size = bg[1];
        var unitSize;
        if(size <= 10){
            unitSize = 105.55555;
        }else if(size > 10 && size <= 15){
            unitSize = 73;
        }else {
            unitSize = 50;
        }
        var CoorX = ($(this)[0].attributes.cx.nodeValue - unitSize)/unitSize;
        var CoorY = ($(this)[0].attributes.cy.nodeValue - unitSize)/unitSize;

        if (CoorX >2 && CoorX<3){
            CoorX = 2;

        }
        if (CoorY >2 && CoorY<3){
            CoorY = 2;

        }

        console.log("Making move: (" + CoorX + ", " + CoorY + ")");

        $.post("/game/" + gameID,
            {
                CoordX: CoorX,
                CoordY: CoorY,
                color: "black", //not sure how to determine my color here....
                pass: false
            }, function(data, textStatus) {
                if (textStatus !== 'success') {
                    alert("Failed to send move to server");
                    console.log("Move failed. Status: " + textStatus);
                }
            });

    });
}
