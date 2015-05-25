var fs = require('fs');
var yaml = require('yamljs')
var amqp = require('amqplib');
var resultConsumer = require('./result.js');

var config = yaml.parse(fs.readFileSync('config.yml').toString());

filters = [];
for(var i in config) {
	// require configured filters
	if(config[i].from !== "result") {
		filters.push(require('./filters/' + config[i].filter + '.js'));	
	}
}

var startFilters = require('./start_filters.js');