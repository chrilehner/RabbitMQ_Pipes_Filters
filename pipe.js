var colors = require('colors/safe');

var channelPromise = require('./rabbitmq_connect.js');
var ConcatenationFilter = require('./filter.js').ConcatenationFilter;
var LowerCaseFilter = require('./filter.js').LowerCaseFilter;
var ReplaceFilter = require('./filter.js').ReplaceFilter;


var Pipe = function(channel, from, to, filters) {
	var channel = channel;
	var from = from;
	var to = to;
	var filters = filters;

	// consuming callback function
	var pipe = function(message) {
		var msg = message.content.toString();

		console.log(colors.yellow("Msg:"), msg);

		filters[0].setResult(msg);

		var result = filters[0].process();

		// remove processed filter
		filters.shift();


		channel.ack(message);

		if(filters.length > 0) {
			filters[0].setResult(result);
			channel.sendToQueue(from, new Buffer(result));	
		}
		else {
			console.log(colors.green("Final result: "), result);
			// TODO: close connection
		}
	}


	var start = function() {
		channel.assertQueue(from, { durable: true });

		// queueName, callback function; noAck: false (default)
		channel.consume(from, pipe);
		
		// start first filter
		var msg = filters[0].process();

		// remove first processed filter
		filters.shift();

		// send message with first result
		channel.sendToQueue(from, new Buffer(msg));
	}

	return {
		start: start
	}
};

var filters = [
	new ConcatenationFilter("Hello", "World..."),
	new LowerCaseFilter(),
	new ReplaceFilter("...", "!")
];

// print descriptions to verify result
console.log("Steps:");
for(var i in filters) {
	console.log("\t", i + ":", filters[i].getDescription());
}
console.log("----------------");

// start after channel is ready
channelPromise.then(function(channel) {
	var pipe = new Pipe(channel, "pipe", "Test", filters);
	pipe.start()
}).catch(function(e) {
	console.log(e);
	process.exit(1);
});
