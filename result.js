var amqp = require('amqplib');
var colors = require('colors/safe');
var config = require('./config.json');

var result = config.result.from;

amqp.connect('amqp://localhost').then(function(connection) {
	return connection;
}).then(function(connection) {
	return connection.createChannel();
}).then(function(channel) {
	channel.assertExchange(result, 'direct', { durable: true });

	// durable true to survive broker restarts (not necessarily needed but the queue doesn't have to be created every time the broker restarts)
	// exclusive and auto_delete set to false by default (not needed)
	channel.assertQueue(result, { durable: true });

	channel.bindQueue(result, result);

	var handleMsg = function(message) {
		console.log(colors.green("Final result:"), message.content.toString());

		// acknowledge message
		channel.ack(message);
	}

	// queueName, callback function; noAck: false (default)
	return channel.consume(result, handleMsg);
}).catch(function(e) {
	console.error(e);
});