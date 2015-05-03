var amqp = require('amqplib');
var when = require('when');

var deferred = when.defer();
amqp.connect('amqp://localhost').then(function(connection) {
	connection.createChannel().then(function(channel) {
		deferred.resolve(channel);
	});
});

module.exports = deferred.promise;
