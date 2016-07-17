// IMPORTS
var express        = require('express');
var sessionManager = require('./lib/session/SessionManager.js');

var app = express();

__staticdir = 'public';

//session middleware router
app.use(sessionManager);
app.use(express.public(staticdir));

app.get('/', function(req, res) {
	res.send("Hello world! I'm running node.js version " + process.version + "! :D");
});

// catch requests to undefined URLs. keep this at the end!
app.get(/.*/, function(req, res) {
	res.sendStatus(404);
});

app.listen(30052, function() {
	console.log("Listening on port 30052");
});
