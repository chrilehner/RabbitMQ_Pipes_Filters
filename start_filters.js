var fs = require('fs');
var yaml = require('yamljs')
var amqp = require('amqplib');

var config = yaml.parse(fs.readFileSync('config.yml').toString());
console.log(config);
var firstFilter = config.lower_case.from;

amqp.connect('amqp://localhost').then(function(connection) {
	return connection;
}).then(function(connection) {
	return connection.createChannel();
}).then(function(channel) {
	channel.assertExchange(firstFilter, 'direct', { durable: true });
	channel.assertQueue(firstFilter, { durable: true });

	channel.bindQueue(firstFilter, firstFilter);

	channel.publish(firstFilter, '', new Buffer("!DLROW OLLEH"));
	console.log("Message sent to", firstFilter);
}).catch(function(e) {
	console.error(e);
});