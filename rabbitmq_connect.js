var amqp = require('amqplib');
var when = require('when');

var deferred = when.defer();
amqp.connect('amqp://localhost').then(function(connection) {
	connection.createChannel().then(function(channel) {
		var rabbitmq_connection = {
			"connection": connection,
			"channel": channel
		}
		deferred.resolve(rabbitmq_connection);
	});
});

module.exports = deferred.promise;
