/*
 * Matchmaking Server Interface - handles all client-side communications
 * with the matchmaking portion of the server.
 *
 * Run JQuery before using this script!
 *
 * Written by Charlie Friend <cdfriend@uvic.ca>
 */

const SIZE_SELECTOR_ID = 'size';

function startHotSeat() {

    // get board size
    var boardSize = $(SIZE_SELECTOR_ID).val();

    $.post(
        "match/startHotSeat",
        {
            boardSize: boardSize
        },
        function(data, textStatus) {
            if (data.redirect) {
                window.location.href = data.redirect;
            }
            else if (textStatus !== 'success') {
                alert("Failed to access server.");
            }
        }
    );

}