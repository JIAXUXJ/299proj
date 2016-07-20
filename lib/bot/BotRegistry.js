/*
 * Bot Registry - Provides access to bots implemented from
 * the BotInterface class.
 */

//IMPORTS
var BotInterface    = require('./BotInterface.js');
var SimonsRandomBot = require('./SimonsRandomBot.js');

// Associative array storing bots indexed by their names.  Use
// the registerBot() method to add to this array.
var registry = new Array();

/**
 * Registers a bot in the registry and verifys that it implements
 * the appropriate interface.
 *
 * @param name {String} The name of the bot to be displayed in the user interface.
 * @param bot {BotInterface} The object containing the bot's move() method.
 *
 * @throws Throws an error if the bot does not implement BotInterface.
 */
function registerBot(name, bot) {

    /*
    //verify bot implements BotInterface
    if (!(bot instanceof BotInterface)) {
        throw new Error('Bots must implement BotInterface.');
    }
    */

    registry[name] = bot;

}

/***** BOT REGISTRATIONS *****/

registerBot("Simon's Random AI", SimonsRandomBot);

/***** END BOT REGISTRATIONS *****/

module.exports = registry;