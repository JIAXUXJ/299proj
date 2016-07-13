/*
 * Session Manager: middleware for identifying the clients currently
 * using the application.
 *
 * Written by Charlie Friend <cdfriend@uvic.ca>
 */

//IMPORTS
var router  = require('express').Router();
var session = require('express-session');
var logger  = require('../util/logger.js');
var MongoStore = require('connect-mongo')(session);

//CONSTANTS
const COOKIE_NAME = "seng299group5-gosession";
const DB_NAME = "test";
const DB_HOST = "localhost";
const DB_PORT = 27017;

//Express docs suggest trust 1st proxy?
//router.set('trust proxy', 1);

//Use session middleware
router.use(session({
    name: COOKIE_NAME,
    secret: "I like turtles",
    //key?
    store : new MongoStore({
        url: "mongodb://" + DB_HOST + ":" + DB_PORT + "/" + DB_NAME
    })
}));

/*
 * Identify if a unique cookie has been assigned to the user making the
 * request.  If one does not exist, assign one.
 */
router.use(function(req, res, next) {

    //TODO

    next();

});

module.exports = router;