/*
 * userRouter - user-account functions (login, logout, change pw/username,...)
 */

var express = require('express');
var uuid 	= require('node-uuid');
var auth    = require('../auth/auth.js');
var db      = require('../db/MongoDB.js');
var logger  = require('../util/logger.js');
var user    = express.Router();

/*
 * Login. On success, return to the previous page.
 */
user.post('/login', function(req, res){
	var pid = req.session.pid;
	var cred_data = req.body.data;
	console.log(cred_data);
	auth.authenticateUser(req, function(data){
		if(!data){
			res.status('401').send('Credentials could not be verified! Please try again.');
		} else {
			res.redirect('back');
		}
	});
});

/*
 * Logout. On success, return to the previous page.
 */
user.get('/logout', function(req, res){
	var pid = req.session.pid;
	db.setSessionAccount(pid, null, function(data){
		if(!data){
			logger.warning('failed to logout session ' + pid);
			res.send('Failed to logout. You have found a horrid bug!').status('503');
		} else {
			res.redirect('back');
		}
	});
});

/*
 * View a user account settings, if possible.
 */
user.get('/settings', function(req, res){
	var pid = req.session.pid;
	db.getSessionById(pid, function(sess_data){
		if(!sess_data){
			res.status('401').send('Hm! Your account or session was not found. Try reloading the page.');
			return;
		} else if (sess_data.account == null){
			res.status('403').send('You are not logged in. Please try logging in first!');
			return;
		}
		db.getUserAccountById(sess_data.account, function(acct_data){
			if(!acct_data){
				res.status('401').send('Hm! Your account or session was not found. Try reloading the page.');
			} else {
				db.setSessionAccount(acct_data._id);
				res.status('200').json(acct_data);
			}
		});
	});
});

user.post('/settings', function(req, res){
	var pid = req.session.pid;
	var new_userinfo = req.body.data;
	db.getSessionById(pid, function(sess_data){
		if(!sess_data){
			res.status('401').send('Hm! Your account or session was not found. Try reloading the page.');
			return;
		} else if (sess_data.account == null){
			res.status('403').send('You are not logged in. Please try logging in first!');
			return;
		}
		db.updatePlayerById(sess_data.account, new_userinfo, function(acct_data){
			if(!acct_data){
				res.status('401').send('Whoops! Could not update your account settings.');
			} else {
				res.status('200').send('Settings updated. Try reloading to see them.');
			}
		});
	});
});

/* register a new user.
 */
user.post('/new', function(req, res){
	var pid = req.session.id;
	var data = req.body.data;
	if(!data){
		res.status('401').send('No XHR data posted.');
		return;
	}
	db.getSessionById(pid, function(sess_data){
		if(!sess_data){
			res.status('401').send('Hm! Your account or session was not found. Try reloading the page.');
			return;
		} else if (sess_data.account != null){
			res.status('403').send('A user is already logged in to this session.');
			return;
		}
		var newuuid = uuid.v4();
		var db_insert = {
			"_id": newuuid,
			"UserName": data.userName,
			"PwHash": data.PwHash,
		}
		db.newPlayer(db_insert, function(acct_data){
			if(!acct_data){
				res.status('401').send('Whoops! Could not create the new account. Please try again.');
			} else {
				res.status('200').send('Account created! Try logging in.');
			}
		});
	});
});

/*
 * Dummy for people trying to GET to user/*.
 */
user.get('/*', function(req, res){
	res.redirect('/index.html');
});

module.exports = user;
