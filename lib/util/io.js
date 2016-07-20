"use strict";

/*
 * IO Module: singleton object for pushing data to clients and
 * recieving it via Socket.io.
 */

//IMPORTS
var SocketIO = require('socket.io');

var started = false;
var io = null;

/**
 * Starts SocketIO for the specified server.  All other methods in
 * this module will throw an error if this has not been called first.
 *
 * Call this only once during application runtime.
 *
 * @param server {Server} The node server object to use with Socket.io.
 */
function init(server) {
    io = SocketIO(server);
    started = true;
}

/**
 * Emits a broadcast from the server to its clients.
 *
 * @param topic {String} The event being broadcast.
 * @param data {Object} Data associated with the event.
 */
function emit(topic, data) {

    if (!started)
        throw new Error("Socket not initialized.");

    io.emit(topic, data);

}

/**
 * Defines a function to be called when the server revieves an event
 * over SocketIO.
 *
 * @param topic {String} The name of the event in question.
 * @param cb {function} The function to be called when data is recieved for
 *                      this event.
 *      - Takes a parameter for a Socket.IO socket object.
 */
function on(topic, cb) {
    if (!started)
        throw new Error("Socket not initialized");

    io.on(topic, cb);

}

function connect(uri, data){

	if (!started)
        throw new Error("Socket not initialized");
        
	io.connect(uri, data);
};

module.exports = {
    init: init,
    emit: emit,
    on: on
};
