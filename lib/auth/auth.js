"use strict";
/*
 *	auth.js - utility approach to authorization and authentication
 */

var router = require('express').Router();
var db     = require('../db/MongoDB.js');

class Auth {
	/* 
	 * authorizeMove(req, cb) checks game move requests for credentials.
	 * req: the (presumably body-parsed XHR) request.
	 * cb: callback function on a boolean value - `true` for authorized,
	 * `false` for unauthorized.
	 */
	authorizeMove(req, cb){
		var player_id = req.session.pid;
		var move = req.body.data;
		db.getGameById(move.game, function(data){
			if(data) {
				if((move.turn == 'black') 
				|| (move.pblack == player_id)){
					cb(true);
				}
				else if((move.turn == 'white')
				|| (move.pwhite == player_id)){
					cb(true);
				}
				else {
					cb(false);
				}
			} else { 
				cb(false); 
			}
		});
	}
	/* users are not implemented yet! :)
	authenticateUser(req, cb){
		var player_id = req.session.pid;
		var cred_data = req.body.data;
		db.getPlayerById(id, function(data){
			if(data) {
			}
		}
	}
	*/
}

var auth = new Auth;
module.exports = router;
