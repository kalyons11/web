var express = require('express');
var config = require('./config');
var fs = require("fs");
var http = require("http");

var app = express();

app.use(express.static('public'));

app.get('/', function(req, res) {
	var model = config.model;
	res.render("index", { model: model });
});

app.get('/courses', function(req, res) {
	var model = config.model;
	res.render("courses", { model: model });
});

var pages = config.pages;

app.get(pages, function(req, res) {
	var model = config.model;
	model.error = {
		url: req.url,
		code: 401
	};
	res.status(401).render("error", { model: model });
});

app.use(function(req, res, next) {
	var model = config.model;
	model.error = {
		url: req.url,
		code: 404
	};
	res.status(404).render("error", { model: model });
});

app.set('views', __dirname + '/views/pages');
app.set('view engine', 'ejs');

var port = process.env.PORT || 5000;
var httpServer = http.createServer(app);
httpServer.listen(port, function() {
    console.log("Listening at port " + port + ".");
});