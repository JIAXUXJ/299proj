"use strict";

/*
 * Database Interface - Functionality required for the application to
 * interact with a database or other method of storing information.
 */

class DBInterface {
    
    function newGame(data, cb) {
        throw new Error("Interface method - not callable.");
    }
    
    function updateGameById(id, data, cb) {
        throw new Error("Interface method - not callable.");
    }
    
    function appendGameMoveById(id, data, cb) {
        throw new Error("Interface method - not callable.");
    }
    
    function getGameById(id, cb) {
        throw new Error("Interface method - not callable.");
    }
    
    function newPlayer(data, cb) {
        throw new Error("Interface method - not callable.");
    }
    
    function getPlayerById(id, cb) {
        throw new Error("Interface method - not callable.");
    }
    
}

module.exports = DBInterface;