"use strict";
/*
 *	auth.js - utility approach to authorization and authentication
 *	auth: alex
 */

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
			if(data){
				if((data.turn == 'black') 
				|| (data.pblack == player_id)){
					cb(true);
					return;
				}
				else if((data.turn == 'white')
				|| (data.pwhite == player_id)){
					cb(true);
					return;
				}
			}
		cb(false);
		});
	}
	
	/* 
	 * Verify supplied user credentials.
	 * @param req {object}: the (presumably body-parsed XHR) request.
	 * @param cb {function}: callback function on a boolean value.
	 * cb is called on `true` for authorized, `false` for unauthorized.
	 */
	authenticateUser(req, cb){
		var pid = req.session.pid;
		var cred_data;
		if(req.body.data){
			cred_data = req.body.data;
		} else {
			cb(false);
			return;
		}
		db.getPlayerByUserName(cred_data.userName, function(data){
			if(data) {
				if(cred_data.pwhash == data.pwhash){
					db.setSessionAccount(pid, data._id, function(data){
						if(!data){
							cb(false);
							return;
						}
					});
					cb(true);
					return;
				}
			}
		cb(false);
		});
	}

}

var auth = new Auth;
module.exports = auth;
