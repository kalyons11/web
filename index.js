var express = require('express');
var config = require('./config');
var fs = require("fs");
var utils = require('./utils/utils');
var moment = require('moment');
var https = require("https");
const uuidV4 = require('uuid/v4');
var JSON = require('./utils/JSON').JSON;

var app = express();

var winston = require('winston');

require('winston-loggly');

app.all(config.do, function(req, res, next) {
    var postDataRaw = {
        'schema_url': 'https://localytics-files.s3.amazonaws.com/schemas/eventsApi/v0.json',
        'app_uuid': utils.decrypt(config.appId),
        'customer_id': 'Random User',
        'event_name': 'Page_Visit',
        'event_time': (new Date()).getTime(),
        'uuid': uuidV4(),
        'attributes' : {
            'url': req.url
        }
    };
    var postData = JSON.stringify(postDataRaw);
    var auth = utils.decrypt(config.apiKey) + ':' + utils.decrypt(config.secret);
    var options = {
        host: config.host,
        port: config.port,
        path: config.path,
        method: 'POST',
        headers: {
            'Accept': '*/*',
            'Authorization': 'Basic ' + new Buffer(auth).toString('base64'),
            'Content-Type': 'application/json',
            'Content-Length': postData.length
        }
    };
    https.request(options, function(response) {
        var body = "";
        response.on('data', function(data) {
            body += data.toString('utf-8');
        });
        response.on('end', function() {
            //here we have the full response, html or json object
            //console.log(postData);
            next();
        })
        response.on('error', function(e) {
            console.log("Got error: " + e.message);
        });
    }).write(postData);
});

app.use(express.static('public'));

app.get('/', function(req, res) {
	var model = config.model;
	res.render("index", { model: model });
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