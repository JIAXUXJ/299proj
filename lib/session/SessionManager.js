/*
 * Session Manager: middleware for identifying the clients currently
 * using the application.
 *
 * Written by Charlie Friend <cdfriend@uvic.ca>
 */

//IMPORTS
var router = require('express').Router();

/*
 * Identify if a unique cookie has been assigned to the user making the
 * request.  If one does not exist, assign one.
 */
router.use(function(req, res, next) {
    //TODO
});
