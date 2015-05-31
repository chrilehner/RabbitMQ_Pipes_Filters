var Q = require('q');
var resultConsumer = require('./result.js');
var rabbitmq_connect = require('./rabbitmq_connect.js');
var colors = require('colors/safe');
var config = require('./config.json');

var filters = [];
var connections = [];
var i = 0;
for(var attribute in config) {
	// require configured filters
	if(config[attribute].from !== "result") {
		// save promises returned from the channel.consume function
		try {
			filters.push(require('./filters/' + config[attribute].filter + '.js'));

			var filter = new filters[i]();
			filter.setFilterID(i);

			connections.push(rabbitmq_connect(filter, config[attribute].from, config[attribute].to));
		}
		catch(e) {
			console.error(e.stack);
			console.log(colors.yellow("Please change the config to use existing filters or implement the new one."));
			process.exit(1);
		}
		
		
	}
	i++;
}

// send first message after every filter is ready to consume
Q.all(connections).then(function() {
	var startFilters = require('./publisher.js');	
}).catch(function(e) {
	console.error(e);
	console.error(e.stack);
});
