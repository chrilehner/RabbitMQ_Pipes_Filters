var ReplaceFilter = function(replace, replaceWith) {
	var replace = replace;
	var replaceWith = replaceWith;
	var result = undefined;

	var process = function() {
		return result.replace(replace, replaceWith);
	}

	var setInput = function(previousResult) {
		result = previousResult;
		//console.log("new result:", result);
	}

	var getDescription = function() {
		return "Replace a substring with another (e.g. replace '...' with '!')";
	}

	return {
		process: process,
		setInput: setInput,
		getDescription: getDescription
	}
}

module.exports = ReplaceFilter;