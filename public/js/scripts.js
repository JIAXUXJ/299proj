/**
 * Created by Joye on 2016-07-20.
 */
/**
 * Requests a new board state from the server's /data route.
 * @param cb {function} callback to call when the request comes back from the server.
 */
var v = parseUrl();
console.log('v["gameID"]: ', v['gameID']);
var bg = v['bg'];

bg = bg.substring(bg.indexOf('?')+1, bg.length);

bg = bg.split(";");
function getData(cb) {
    gameID = v['gameID'];
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
function drawBoard(state) {
    //bg is a string passed from user setting page, it is a string look like:
    // token-color; bg-color; size

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
    var W = size * unitSize+ unitSize, H = size * unitSize+ unitSize;
    canvas.css("height", H );
    canvas.css("width", W );

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
    for(i = 0; i <= W; i+=unitSize){
        for(j = 0; j <= H; j+=unitSize ){
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

    // TODO : only thing need to be change when data refreshed from server.
    for(var i = 0; i < size; i++){
        for (var j = 0; j < size; j ++){
            svg.append(makeCircle(i*unitSize + unitSize, j*unitSize + unitSize, unitSize/2.5, 'rgba(255, 255, 255, 0)'));
            // if(state.board[i][j] == 0){
            //     svg.append(makeCircle(i*unitSize + unitSize, j*unitSize + unitSize, unitSize/2.5, 'rgba(1, 1, 1, 1)'));//black
            // }else if(state.board[i][j] == 1){
            //     svg.append(makeCircle(i*unitSize + unitSize, j*unitSize + unitSize, unitSize/2.5, 'rgba(255, 255, 255, 1)'));//white
            // }else if(state.board[i][j] == 2){
            //     svg.append(makeCircle(i*unitSize + unitSize, j*unitSize + unitSize, unitSize/2.5, 'rgba(255, 255, 255, 0)'));//nothing
            // }else{
            //     svg.append(makeCircle(i*unitSize + unitSize, j*unitSize + unitSize, unitSize/2.5, 'rgba(255, 255, 255, 0)'));
            // }
        }
    }
    canvas.append(svg);
    gamePlay();
}
function gamePlay(){
    $('circle').on('click', function () {
        console.log(">>>>>>>>>>>");
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
        if(CoorX > 2 && CoorX < 3){
            CoorX = 2;
        }
        if(CoorY > 2 && CoorY < 3){
            CoorY = 2;
        }
        console.log(CoorX, CoorY);

    });
    $('#canvas-board').on('mouseover', function () {
        // location.href = "./img/black.ani";
        // $(this)[0].style.cursor = url('./img/black.ani');
        // $(this)[0].css({cursor: "help"});
    });


}
function passToken() {
    $('#pass').on = ('click', function () {
        console.log(">>>>>>>>>>>>>");
    });
}
function init() {
    console.log("Initalizing Page...");
    // TODO: request data from server
    getData(drawBoard);
    //gamePlay func can return the position of circle.




}
init();