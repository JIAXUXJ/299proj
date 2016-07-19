/*
 * Session Manager: middleware for identifying the clients currently
 * using the application.
 *
 * Written by Charlie Friend <cdfriend@uvic.ca>
 * and alex!
 */

//IMPORTS
var router  = require('express').Router();
var session = require('express-session');
var logger  = require('../util/logger.js');
var uuid 	= require('node-uuid');
var MongoStore = require('connect-mongo')(session);

//CONSTANTS
const COOKIE_NAME = "seng299group5-gosession";
const DB_NAME = "test";
const DB_HOST = "localhost";
const DB_PORT = 27017;

//Express docs suggest trust 1st proxy?
//router.set('trust proxy', 1);

/*
 * Use session middleware.
 * using settings recommended by `express-session` documentation.
 * A note on `genuid`: we could use an incrementing number if we wanted. The
 * `secret` is meant to elongate the uid for storage in a cookie, so that even
 * if a poor choice of uid is made, it's not insecure to session hijackers.
 * (says express-session devs)
 */
router.use(session({
    name: COOKIE_NAME,
    secret: "I like turtles",
    resave: false,
    saveUninitialized: true,
    genuid: function() {	//client-side (cookie) ID
    	return uuid.v4();
    },
    store: new MongoStore({
        url: "mongodb://" + DB_HOST + ":" + DB_PORT + "/" + DB_NAME
    })
}));

/*
 * Identify if a unique player ID has been assigned to the user making the
 * request (e.g., by logging in).  If one does not exist, assign one.
 */
router.use(function(req, res, next){
	if(!req.session.pid){
		//console.log("generating anonymous pid for session " + req.sessionID + ".");
		req.session.pid = uuid.v4();
	}
	next();
});

module.exports = router;
