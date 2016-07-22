/**
 * Created by Joye on 2016-07-21.
 */
function gamePlay(){
    $('#canvas-board').on('mouseover', function () {
        // location.href = "./img/black.ani";
        // $(this)[0].style.cursor = url('./img/black.ani');
        // $(this)[0].css({cursor: "help"});
    });

    $('circle').on('click', function () {

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
        if(CoorX > 2 && CoorX < 3){
            CoorX = 2;
        }
        if(CoorY > 2 && CoorY < 3){
            CoorY = 2;
        }
        console.log(CoorX, CoorY);


    });
}
gamePlay();