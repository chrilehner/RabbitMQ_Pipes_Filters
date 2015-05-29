var ReverseFilter = function() {

	var id = 0;

	var setFilterID = function(filterID) {
		id = filterID;
	}

	var getFilterID = function() {
		return id;
	}

	var getFilterType = function() {
		return "Reverse";
	}

	var process = function(msg) {
		return msg.split("").reverse().join("");
	}

	return {
		process: process,
		setFilterID: setFilterID,
		getFilterID: getFilterID,
		getFilterType: getFilterType
	}
}

module.exports = ReverseFilter;