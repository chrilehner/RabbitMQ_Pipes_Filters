var fs = require('fs');
var yaml = require('yamljs')
var amqp = require('amqplib');
var Pipe = require('../pipe.js');

var config = yaml.parse(fs.readFileSync('config.yml').toString());

var LowerCaseFilter = function() {

	var process = function(msg) {
		console.log("MSG:", msg);
		return msg.toLowerCase();
	}

	var getDescription = function() {
		return "Transform to lower case";
	}

	return {
		process: process,
		getDescription: getDescription
	}
}

var filter = new LowerCaseFilter();

amqp.connect('amqp://localhost').then(function(connection) {
	return connection;
}).then(function(connection) {
	return connection.createChannel();
}).then(function(channel) {
	var pipe = new Pipe(channel, config.lower_case.from, config.lower_case.to, filter);
	pipe.start();
}).catch(function(e) {
	console.error(e);
});


module.exports = LowerCaseFilter;