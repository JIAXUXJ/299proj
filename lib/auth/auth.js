"use strict";
/*
 *	auth.js - utility approach to authorization and authentication
 *	auth: alex
 */

var router = require('express').Router();
var db     = require('../db/MongoDB.js');

class Auth {
	/* 
	 * Hash a string. We need a better algorithm, maybe.
	 * @param string {string}: string to be hashed.
	 * returns the string's hash as an integer.
	 */
	hash(string){
		//TODO: use better algo!!!! this is djb2
		var hash = 5381;
		for(var i = 0; i < string.length; i++){
			var char = str.charCodeAt(i);
			hash = ((hash<<5) + hash) + char;
		}
		return hash;
	}
	/* 
	 * Check game move requests for credentials.
	 * @param req {object}: the (presumably body-parsed XHR) request.
	 * @param cb {function}: callback function on a boolean value.
	 * cb is called on `true` for authorized, `false` for unauthorized.
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
	/* 
	 * Verify supplied user credentials.
	 * @param req {object}: the (presumably body-parsed XHR) request.
	 * @param cb {function}: callback function on a boolean value.
	 * cb is called on `true` for authorized, `false` for unauthorized.
	 */
	authenticateUser(req, cb){
		var player_id = req.session.pid;
		var cred_data = req.body.data;
		cb(false);
		return;
		predicated on the existence of a name-based player lookup
		db.getPlayerByUserName(cred_data.name, function(data){
			if(data) {
				var creds_hash = hash(cred_data.pw);
				if(creds_hash == data.pwhash){
					cb(true);
				} else {
					cb(false);
				}
			} else {
				cb(false);
			}
		}
	}

}

var auth = new Auth;
module.exports = router;
