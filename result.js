var fs = require('fs');
var yaml = require('yamljs')
var amqp = require('amqplib');
var colors = require('colors/safe');


var config = yaml.parse(fs.readFileSync('config.yml').toString());

console.log("Result:", config);
var result = config.result.from;

amqp.connect('amqp://localhost').then(function(connection) {
	return connection;
}).then(function(connection) {
	return connection.createChannel();
}).then(function(channel) {
	channel.assertExchange(result, 'direct', { durable: false, autoDelete: true });

	// durable true to survive broker restarts (not necessarily needed but the queue doesn't have to be created every time the broker restarts)
	// exclusive and auto_delete set to false by default (not needed)
	channel.assertQueue(result, { durable: false, autoDelete: true });

	channel.bindQueue(result, result);

	var handleMsg = function(message) {
		console.log(colors.green("Final result:"), message.content.toString());

		// acknowledge message
		channel.ack(message);
	}

	// queueName, callback function; noAck: false (default)
	channel.consume(result, handleMsg);
}).catch(function(e) {
	console.error(e);
});