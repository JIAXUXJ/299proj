// IMPORTS
var express = require('express');

var app = express();

app.get('/', function(req, res) {
	res.send("Hello world! I'm running node.js version " + process.version + "! :D");
});

app.listen(30052, function() {
	console.log("Listening on port 30052");
});
