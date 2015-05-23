var LowerCaseFilter = function() {
	var result = undefined;

	var process = function() {
		return result.toLowerCase();
	}

	var setInput = function(previousResult) {
		result = previousResult;
	}

	var getDescription = function() {
		return "Transform to lower case";
	}

	return {
		process: process,
		setInput: setInput,
		getDescription: getDescription
	}
}

module.exports = LowerCaseFilter;