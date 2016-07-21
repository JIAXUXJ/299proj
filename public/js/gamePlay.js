/**
 * Created by Joye on 2016-07-21.
 */
function gamePlay(){

    $('#canvas-board').on('mouseover', function () {
        $(this)[0].style.cursor = "help";
    });
}
gamePlay();