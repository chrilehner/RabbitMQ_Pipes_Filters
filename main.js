var Q = require('q');
var consumer = require('./result.js');
var rabbitmq_connect = require('./rabbitmq_connect.js');
var colors = require('colors/safe');
var config = require('./config.json');

// use specific filter via arguments
var filterArgument = process.argv[2];

var filters = [];
var connections = [];
var i = 0;

connections.push(consumer());

if(filterArgument === "help") {
	console.log("This pipes and filters implementation uses RabbitMQ.");
	console.log(colors.green("Usage: npm run [filterArgument]"));
	console.log("\t[filterArgument]: a filter implementation in your filters folder (e.g. LowerCaseFilter)");
	process.exit(0);
}



var initializeConnections = function(attribute) {
	// save promises returned from the channel.consume function
	try {
		filters.push(require('./filters/' + config[attribute].filter + '.js'));

		var filter = new filters[i]();
		filter.setFilterID(i);

		return rabbitmq_connect(filter, config[attribute].from, config[attribute].to);
	}
	catch(e) {
		console.error(e.stack);
		console.log(colors.yellow("Please change the config to use existing filters or implement the new one."));
		process.exit(1);
	}
}

if(!filterArgument) {
	for(var attribute in config) {
		// require configured filters
		if(config[attribute].from !== "result") {
			connections.push(initializeConnections(attribute));
		}
		i++;
	}
}
else {
	for(var attribute in config) {
		if(config[attribute].filter === filterArgument) {
			connections.push(initializeConnections(attribute));
			break;
		}
	}
}


// send first message after every filter is ready to consume
Q.all(connections).then(function() {
	var publisher = require('./publisher.js');	
}).catch(function(e) {
	console.error(e);
	console.error(e.stack);
});
