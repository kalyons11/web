var CryptoJS = require('crypto-js');
var config = require('../config');
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