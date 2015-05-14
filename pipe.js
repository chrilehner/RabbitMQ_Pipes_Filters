var colors = require('colors/safe');

var rabbitmqPromise = require('./rabbitmq_connect.js');
var ConcatenationFilter = require('./filter.js').ConcatenationFilter;
var LowerCaseFilter = require('./filter.js').LowerCaseFilter;
var ReplaceFilter = require('./filter.js').ReplaceFilter;


var Pipe = function(connection, channel, queueName, filters) {
	var connection = connection;
	var channel = channel;
	var queueName = queueName;
	var filters = filters;

	// consuming callback function
	var pipe = function(message) {
		var msg = message.content.toString();

		console.log(colors.yellow("Msg:"), msg);

		filters[0].setInput(msg);

		var result = filters[0].process();

		// remove processed filter
		filters.shift();

		// acknowledge message
		channel.ack(message);
		if(filters.length > 0) {
			filters[0].setInput(result);
			// send new message to queue
			channel.sendToQueue(queueName, new Buffer(result));	
		}
		else {
			console.log(colors.green("Final result:"), result);
		}
	}


	var start = function() {
		// durable true to survive broker restarts (not necessarily needed but the queue doesn't have to be created every time the broker restarts)
		// exclusive and auto_delete set to false by default (not needed)
		channel.assertQueue(queueName, { durable: true });

		// queueName, callback function; noAck: false (default)
		channel.consume(queueName, pipe);
		
		// start first filter
		var msg = filters[0].process();

		// remove first processed filter
		filters.shift();

		// send message with first result
		channel.sendToQueue(queueName, new Buffer(msg));
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

rabbitmqPromise.then(function(rabbitmq_connection) {
	var pipe = new Pipe(rabbitmq_connection.connection, rabbitmq_connection.channel, "pipe", filters);
	pipe.start()
}).catch(function(e) {
	console.error(colors.red(e));
	process.exit(1);
});
