var CryptoJS = require('crypto-js');
var config = require('./config');

var hasher = config.hasher;

module.exports.encrypt = function(string) {
	var result = CryptoJS.AES.encrypt(string, hasher);
	return result.toString();
};

module.exports.decrypt = function(string) {
	var bytes  = CryptoJS.AES.decrypt(string, hasher);
	var result = bytes.toString(CryptoJS.enc.Utf8);
	return result;
};

module.exports.remoteIP = function(ip) {
	return ip != "::1";
};

module.exports.fixIP = function(ip) {
    var indexOfColon = ip.lastIndexOf(':');
    var newIP = ip.substring(indexOfColon + 1);
    return newIP;
};