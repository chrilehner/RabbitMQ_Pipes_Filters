var channelPromise = require('./rabbitmq_connect.js');
var ConcatenationFilter = require('./filter.js').ConcatenationFilter;
var SearchFilter = require('./filter.js').SearchFilter;

// ToDo: multiple Filters

var Pipe = function(channel, from, to, filter) {
	var channel = channel;
	var from = from;
	var to = to;
	var filter = filter;
	var that = this;

	var pipe = function(message) {
		var result = filter.process();
		channel.ack(message);

		console.log(result)
	}


	var start = function() {
		channel.assertQueue(from, { durable: true });

		// noAck: false
		channel.consume(from, pipe);
		
		// start first filter
		var msg = filter.process("Hello", "world");
		console.log(msg)

		// queueName, message
		channel.sendToQueue(from, new Buffer(msg));
	}

	return {
		start: start
	}
};



channelPromise.then(function(channel) {
	var filter = new ConcatenationFilter();
	var pipe = new Pipe(channel, "pipe", "Test", filter);
	pipe.start()
}).catch(function(e) {
	console.log(e);
	process.exit(1);
});