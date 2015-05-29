var amqp = require('amqplib');
var config = require('./config.json');

var firstFilter = config.lower_case.from;

amqp.connect('amqp://localhost').then(function(connection) {
	return connection;
}).then(function(connection) {
	return connection.createChannel();
}).then(function(channel) {
	channel.assertExchange(firstFilter, 'direct', { durable: true });
	channel.assertQueue(firstFilter, { durable: true });

	channel.bindQueue(firstFilter, firstFilter);

	for(var i = 0; i < 100; i++) {
		channel.publish(firstFilter, '', new Buffer("!DLROW OLLEH"));
	}

}).catch(function(e) {
	console.error(e);
});