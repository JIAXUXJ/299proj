"use strict";

/*
 * Bot Interface - Functionality required to get conduct a
 * Go game with an AI player.
 *
 * Written by Charlie Friend <cdfriend@uvic.ca>
 */

class BotInterface {

    /**
     * Sends a board state to the bot and defines a callback to
     * be used when it responds.
     *
     * @param boardState {Array[][]} The current board state.
     * @param cb {function(x, y)} A function to be called when the operation completes.
     *      - Takes two parameters, "x" and "y", specifying the bot's move position from
     *        the top and left sides of the board, respectively.
     */
    move(boardState, cb) {
        throw new Error("Interface method - not callable.");
    }

}

module.exports = BotInterface;