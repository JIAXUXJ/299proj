"use strict";
/*
 *	auth.js - utility approach to authorization and authentication
 *	auth: alex
 */

var db     = require('../db/MongoDB.js');
var logger  = require('../util/logger.js');

class Auth {

	/* 
	 * Hash a string. We need a better algorithm, maybe.
	 * @param string {string}: string to be hashed.
	 * returns the string's hash as an integer.
	 */
	hash(string){
		//TODO: use better algo!!!! this is sdbm
		var hash = 0;
		var c;
		for(c = 0; c < string.length ; c++){
			hash = string.charCodeAt(c) + (hash<<6)+(hash<<16)-hash;
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
		var move = req.body;
		db.getGameById(move.Game, function(data){
			if(data){
				if((data.Turn == 'Black')
				|| (data.PBlackID == player_id)){
					cb(true);
					return;
				}
				else if((data.Turn == 'White')
				|| (data.PBlackID == player_id)){
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
		var pid = req.sessionID;
		var cred_data;
		if(req.body){
			cred_data = req.body;
		} else {
			cb(false);
			return;
		}
		db.getPlayerByUserName(cred_data.userName, function(data){
			if(data) {
				logger.debug(JSON.stringify(data));
				if(cred_data.PwHash == data.PwHash){
					db.setSessionAccount(pid, data._id, function(data){
						if(!data){
							cb(false);
							return;
						} else {
                            cb(true);
                        }
					});
				}
			} else {
                cb(false);
            }

		});
	}

}

var auth = new Auth;
module.exports = auth;
