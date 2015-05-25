/*
TODO:
 - funktioniert noch nicht, weil anfangs der neue filter noch nicht auf die queue hört - messages gehen verloren!
 - autoDelete option löschen


*/



var colors = require('colors/safe');

var Pipe = function(channel, from, to, filter) {
	var channel = channel;
	var from = from;
	var to = to;
	var filter = filter;

	// consuming callback function
	var handleMsg = function(message) {
		var msg = message.content.toString();

		console.log(colors.yellow("Msg:"), msg);

		var newMessage = filter.process(msg);

		// acknowledge message
		channel.ack(message);
		channel.publish(to, '', new Buffer(newMessage));
	}


	var start = function() {
		channel.assertExchange(to, 'direct', { durable: false, autoDelete: true });

		// durable true to survive broker restarts (not necessarily needed but the queue doesn't have to be created every time the broker restarts)
		// exclusive and auto_delete set to false by default (not needed)
		channel.assertQueue(from, { durable: false, autoDelete: true });

		channel.bindQueue(from, from);

		// queueName, callback function; noAck: false (default)
		channel.consume(from, handleMsg);
		console.log("PIPE");
	}

	return {
		start: start
	}
};

module.exports = Pipe;
