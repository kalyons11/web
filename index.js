var express = require('express');
var config = require('./config');
var fs = require("fs");

var app = express();

app.use(express.static('public'));

app.get('/', function(req, res) {
	var model = config.model;
	res.render("home", { model: model }); 
});

app.get('/assets/*', function(req, res) {
	next();
});

app.set('views', __dirname + '/views/pages');
app.set('view engine', 'ejs');

var port = process.env.PORT || 5000;
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    console.log('Began client on port ' + port + '.');
});