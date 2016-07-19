"use strict";
/*
 *	auth.js - utility approach to authorization and authentication
 */

var router = require('express').Router();
var db     = require('../db/MongoDB.js');

class Auth {
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
	
	authenticateUser(req, cb){
		var player_id = req.session.pid;
		var cred_data = req.body.data;
		cb(false);
		return;
		/* predicated on the existence of a name-based player lookup
		db.getPlayerByName(cred_data.name, function(data){
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
		*/
	}

}

var auth = new Auth;
module.exports = router;
