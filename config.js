/*
 * Server Configuration Module: provides data required by various modules
 * of the software to run in a particular configuration.  For example, the
 * module provides the location of the server's mongo database in both test
 * and deployment environments.
 *
 * The {@link init()} function should be called once at the start of the
 * program to define all the necessary information for the session.  Afterwards,
 * config data can be found using require('config.js').data.[MODULE_NAME].
 */

var data = {};

/**
 * Defines config data for a particular session.
 *
 * @param cfgString {String} The configuration type to use. If this is unspecified,
 * then the module will use the TEST configuration.
 *
 * Configuration types:
 *
 *      - TEST: For running the application on a local machine.
 *
 *      - DEPLOY: For running the application on the UVic engineering network.
 */
function init(cfgString) {

    //DB Config
    data.db.HOST = 'localhost';
    data.db.PORT = 27017;
    data.db.NAME = cfgString === 'DEPLOY' ? 'seng299group5' : 'test';
    data.db.USER_COLLECTION = 'users';
    data.db.GAME_COLLECTION = 'games';

}

module.exports = {
    init : init,
    data : data
};
