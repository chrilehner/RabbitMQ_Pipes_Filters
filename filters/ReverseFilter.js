var fs = require('fs');
var yaml = require('yamljs')
var amqp = require('amqplib');
var Pipe = require('../pipe.js');

var config = yaml.parse(fs.readFileSync('config.yml').toString());

var ReverseFilter = function() {

	var process = function(msg) {
		return msg.split("").reverse().join("");
	}

	var getDescription = function() {
		return "Reverse a string(e.g. 'hello world!' -> !)";
	}

	return {
		process: process,
		getDescription: getDescription
	}
}

var filter = new ReverseFilter();

amqp.connect('amqp://localhost').then(function(connection) {
	return connection;
}).then(function(connection) {
	return connection.createChannel();
}).then(function(channel) {
	var pipe = new Pipe(channel, config.reverse.from, config.reverse.to, filter);
	pipe.start();
}).catch(function(e) {
	console.error(e);
});

module.exports = ReverseFilter;