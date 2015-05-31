var amqp = require('amqplib');
var colors = require('colors/safe');
var rabbitmq_connect = require('./rabbitmq_connect.js');

var config = require('./config.json');

var result = config.result.from;

rabbitmq_connect(undefined, config.result.from, undefined);