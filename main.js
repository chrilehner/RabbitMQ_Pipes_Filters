var fs = require('fs');
var yaml = require('yamljs')
var amqp = require('amqplib');
var Q = require('q');
var resultConsumer = require('./result.js');

var config = yaml.parse(fs.readFileSync('config.yml').toString());

var connections = [];
for(var i in config) {
	// require configured filters
	if(config[i].from !== "result") {
		// save promises returned from the channel.consume function
		connections.push(require('./filters/' + config[i].filter + '.js').connect());
	}
}

// send first message after every filter is ready to consume
Q.all(connections).then(function() {
	var startFilters = require('./start_filters.js');	
});
