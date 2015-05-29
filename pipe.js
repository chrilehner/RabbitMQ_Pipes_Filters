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

		// exchange, routing key, message
		channel.publish(to, '', new Buffer(newMessage));
	}


	var start = function() {
		// durable: true, internal: false, autoDelete: false, alternateExchange: ""
		channel.assertExchange(from, 'direct', { durable: true });

		// exclusive: false, durable: true, autoDelete: false
		channel.assertQueue(from, { durable: true });

		channel.bindQueue(from, from);

		// limit unacknowledged messages to 1 per channel (1 filter processes one message at a time)
		channel.prefetch(1);

		//  get promise for channel to consume when it's ready and return to rabbitmq_connect.js
		var promise = channel.consume(from, handleMsg);
		return promise;
	}

	return {
		start: start
	}
};

module.exports = Pipe;
