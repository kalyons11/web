var CryptoJS = require('crypto-js');
var config = require('../config');
var request = require("request");
var Promise = require('promise');
var http = require('http');
var JSON = require('./JSON').JSON;

var hasher = config.hasher;
var key = config.key;

module.exports.encrypt = function(string) {
	var result = CryptoJS.AES.encrypt(string, hasher);
	return result.toString();
};

module.exports.decrypt = function(string) {
	var bytes  = CryptoJS.AES.decrypt(string, hasher);
	var result = bytes.toString(CryptoJS.enc.Utf8);
	return result;
};

key = exports.decrypt(key);

module.exports.remoteIP = function(ip) {
	return ip != "1";
};

module.exports.fixIP = function(ip) {
    var indexOfColon = ip.lastIndexOf(':');
    if (indexOfColon > -1) {
    	var newIP = ip.substring(indexOfColon + 1);
    	return newIP;
    } else return ip;
};

module.exports.getLocation = function(ip) {
	return new Promise(function(fulfill, reject) {
		var options = {
		  host: 'ipinfo.io',
		  port: 80,
		  path: '/' + ip
		};
		http.get(options, function(res) {
			res.on("data", function(chunk) {
				var body = chunk.toString("Utf8");
				var object = JSON.parse(body);
			    fulfill(JSON.stringify(object));
			});
		});
	});
};