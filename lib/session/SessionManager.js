/*
 * Session Manager: middleware for identifying the clients currently
 * using the application.
 *
 * Written by Charlie Friend <cdfriend@uvic.ca>
 */

//IMPORTS
var router  = require('express').Router();
var session = require('cookie-session');
var logger  = require('../util/logger.js');

//CONSTANTS
const COOKIE_NAME = "seng299group5-gosession";

//Express docs suggest trust 1st proxy?
//router.set('trust proxy', 1);

router.use(session({
    name: COOKIE_NAME,
    //keys?
}));

/*
 * Identify if a unique cookie has been assigned to the user making the
 * request.  If one does not exist, assign one.
 */
router.use(function(req, res, next) {

    if(req.session.isNew) {
        logger.debug('New session connected from ' + req.ip);
    }

});
