var channelPromise = require('./rabbitmq_connect.js');
var Filter = require('./filter.js');


var Pipe = function(channel, from, to, filter) {
	var channel = channel;
	var from = from;
	var to = to;
	var filter = filter;
	var that = this;


// für jedes from und to eigene queues?
// das erste mal muss der filter selbst aufgerufen und eine nachricht verschickt werden

	var pipe = function(message) {
		console.log("handle message");
		var result = filter.process();
		channel.ack(message);

		console.log(result)
	}


	var start = function() {
		channel.assertQueue(from, { durable: true });

		// noAck: false
		channel.consume(from, pipe);
		
		// start first filter
		var msg = filter.process();

		// queueName, message
		channel.sendToQueue(from, new Buffer(msg));
	}

	return {
		start: start
	}
};



channelPromise.then(function(channel) {
	var filter = new Filter();
	var pipe = new Pipe(channel, "pipe", "Test", filter);
	pipe.start()
});




// amqp.connect('amqp://localhost').then(function(connection) {
// 	return when(connection.createChannel().then(function(channel) {

// 		var ok = channel.assertQueue(queueName, {durable: false});

// 		var ok = ok.then(function() {
// 			channel.publish('', serverName, new Buffer(msg), {
// 				"replyTo": queueName,
// 				"correlationId": "1"
// 			});
// 			console.log("Request '%s'", msg);
			
// 		});

// 		ok = ok.then(function() {
// 			return channel.consume(queueName, processMessages, {noAck: true})
// 		});

// 		return ok.then(function(_consumeOk) {
// 		});

// 		function processMessages(msg) {
// 			console.log("Response: ", msg.content.toString());
// 			//return channel.close();
// 			//channel.ack(msg);
// 		}

// 	})).ensure(function() { connection.close(); });
// }).then(null, console.warn);