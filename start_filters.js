var amqp = require('amqplib');

var firstFilter = 'lower_case';

amqp.connect('amqp://localhost').then(function(connection) {
	return connection;
}).then(function(connection) {
	return connection.createChannel();
}).then(function(channel) {
	channel.assertExchange(firstFilter, 'direct', { durable: false, autoDelete: true });

	// durable true to survive broker restarts (not necessarily needed but the queue doesn't have to be created every time the broker restarts)
	// exclusive and auto_delete set to false by default (not needed)
	channel.assertQueue(firstFilter, { durable: false, autoDelete: true });

	channel.bindQueue(firstFilter, firstFilter);

	channel.publish(firstFilter, '', new Buffer("!DLROW OLLEH"));
}).catch(function(e) {
	console.error(e);
});