var express = require('express');
var config = require('./config');
var fs = require("fs");
var utils = require('./utils');
var geoip = require('geoip-lite');

var app = express();

var logglyToken = config.logglyToken;
logglyToken = utils.decrypt(logglyToken);
var logglySubdomain = config.logglySubdomain;
var logglyTags = config.logglyTags;

var winston = require('winston');

require('winston-loggly');
 
winston.add(winston.transports.Loggly, {
    token: logglyToken,
    subdomain: logglySubdomain,
    tags: logglyTags,
    json: true
});

app.use(express.static('public'));

app.all('/', function(req, res, next) {
	var ip = req.connection.remoteAddress;
	if (ip == null)
		ip == req.headers['x-forwarded-for'];
	ip = utils.fixIP(ip);
	if (utils.remoteIP(ip)) {
		var geo = geoip.lookup(ip);
		winston.log('info', 'New web request detected.', { geo: geo, ip: ip });
	}
	next();
});

app.get('/', function(req, res) {
	var model = config.model;
	res.render("home", { model: model }); 
});

var pages = config.pages;

app.get(pages, function(req, res) {
	winston.log('error', "Unauthorized request.", { url: req.url });
	var model = config.model;
	model.error = {
		url: req.url,
		code: 401
	};
	res.status(401).render("error", { model: model });
});

app.use(function(req, res, next) {
	winston.log('error', "Page not found.", { url: req.url });
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
var httpServer = require('http').createServer(app);
httpServer.listen(port, function() {
    // Listen...
});