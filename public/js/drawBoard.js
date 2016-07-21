/**
 * Created by Joye on 2016-07-20.
 */
/**
 * Requests a new board state from the server's /data route.
 * @param cb {function} callback to call when the request comes back from the server.
 */

// TODO: I didn't used this function, it request data from server.
function getData(cb) {
    $.get("/data", function(data, textStatus, xhr){
        console.log("Response for /data: "+textStatus);
        console.log("data: ", data)
        // handle any errors here....

        // draw the board....
        cb(data);

    });
}
function drawBoard() {
    //bg is a string passed from user setting page, it is a string look like:
    // token-color; bg-color; size
    console.log(window.location.search);
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
    var canvas = $('#canvas-board');
    var W = size * unitSize, H = size * unitSize;
    canvas.css("height", H );
    canvas.css("width", W );

    // Change the height and width of the board here...
    // The actual SVG element to add to.
    // we make a jQuery object out of this, so that
    // we can manipulate it via calls to the jQuery API.
    var svg = $(makeSVG(W, H));

    var i, j;
    svg.append($(makeRectangle(10, 10, unitSize, unitSize, 'burlywood')));

    var bgcolor1, bgcolor2;
    if(bg.length === 4){
        bgcolor1 = bg[2];
        bgcolor2 = bg[3];
        console.log(bgcolor1, bgcolor2)
    }else {
        bgcolor1 = bgcolor2 = bg[2];
    }
    //draw every unit rectangle
    for(i = 0; i < W; i+=unitSize){
        for(j = 0; j < H; j+=unitSize ){
            //if-else comment: make the color different in the different unit.
            if((i/unitSize)%2 == 0 && (j/unitSize)%2 == 0 || (i/unitSize)%2 == 1 && (j/unitSize)%2 == 1){
                svg.append($(makeRectangle(i, j, unitSize, unitSize, bgcolor1)));
            }else {
                svg.append($(makeRectangle(i, j, unitSize, unitSize, bgcolor2)));
            }
        }
    }
    
    for(var k = unitSize; k < W; k+=unitSize){
        svg.append(makeLine(k, 1, k, W-1));
    }
    
    for(var a = unitSize; a < H; a+=unitSize){
        svg.append(makeLine(1, a, H-1, a));
    }

    canvas.append(svg);
}
function init() {
    console.log("Initalizing Page...");
    // TODO: request data from server
    // getData(drawBoard);

    //to test now:
    drawBoard();
}
init();