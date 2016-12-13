var CryptoJS = require('crypto-js');
var config = require('../config');
var request = require("request");
var Promise = require('promise');
var http = require('http');
var JSON = require('./JSON').JSON;
var crypto = require('cryptlib');

var iv = "_sbSmKUxVQAQ-hvQ"; // 16 bytes = 128 bit
var key = "1bf6bf65e45b55825b1919cbadd028e6";

module.exports.encrypt = function(string) {
    var cypherText = crypto.encrypt(string, key, iv);
    return cypherText;
};

module.exports.encryptObject = function (object) {
    var cypherText = crypto.encrypt(JSON.stringify(object), key, iv);
    return cypherText;
};

module.exports.decrypt = function(string) {
    var dec = crypto.decrypt(string, key, iv);
    return dec;
};

module.exports.decryptObject = function (string) {
    var dec = crypto.decrypt(string, key, iv);
    return JSON.parse(dec);
};

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