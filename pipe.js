var colors = require('colors/safe');

var Pipe = function(channel, from, to, filter) {
	var channel = channel;
	var from = from;
	var to = to;
	var filter = filter;

	// consuming callback function
	var handleMsg = function(message) {
		var msg = message.content.toString();
		console.log("GOT MSG FROM", from);
		console.log("Filter to process message", filter.getFilterType(), filter.getFilterID());

		console.log(colors.yellow("Msg:"), msg);

		var newMessage = filter.process(msg);

		// acknowledge message
		channel.ack(message);
		channel.publish(to, '', new Buffer(newMessage));
	}


	var start = function() {
		// console.log("FROM", from);
		channel.assertExchange(from, 'direct', { durable: true });

		// durable true to survive broker restarts (not necessarily needed but the queue doesn't have to be created every time the broker restarts)
		// exclusive and auto_delete set to false by default (not needed)
		channel.assertQueue(from, { durable: true });

		channel.bindQueue(from, from);

		channel.prefetch(1);

		// queueName, callback function; noAck: false (default)
		var promise = channel.consume(from, handleMsg);
		return promise;
	}

	return {
		start: start
	}
};

module.exports = Pipe;
