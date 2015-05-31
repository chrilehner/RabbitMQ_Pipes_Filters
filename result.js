var amqp = require('amqplib');
var colors = require('colors/safe');
var rabbitmq_connect = require('./rabbitmq_connect.js');

var config = require('./config.json');

var result = config.result.from;


var initializeConsumer = function(from) {
	if(from) {
		console.log("FROM:", from);
		return rabbitmq_connect(undefined, from, undefined);
	}
	return rabbitmq_connect(undefined, config.result.from, undefined);
}

module.exports = initializeConsumer;