var config = require('../config.json');

var LowerCaseFilter = function() {

	var id = 0;

	var setFilterID = function(filterID) {
		id = filterID;
	}

	var getFilterID = function() {
		return id;
	}

	var getFilterType = function() {
		return "LowerCase";
	}

	var process = function(msg) {
		return msg.toLowerCase();
	}

	return {
		process: process,
		setFilterID: setFilterID,
		getFilterID: getFilterID,
		getFilterType: getFilterType
	}
}

module.exports = LowerCaseFilter;