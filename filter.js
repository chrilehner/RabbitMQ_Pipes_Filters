var ConcatenationFilter = function(text, otherText) {
	var text = text;
	var otherText = otherText;

	var process = function() {
		return text + " " + otherText;
	}

	var getDescription = function() {
		return "Concatenate two words (e.g. 'Hello' and 'World...')";
	}

	return {
		process: process,
		getDescription: getDescription
	}
}

var LowerCaseFilter = function() {
	var result = undefined;

	var process = function() {
		return result.toLowerCase();
	}

	var setResult = function(previousResult) {
		result = previousResult;
	}

	var getDescription = function() {
		return "Transform to lower case";
	}

	return {
		process: process,
		setResult: setResult,
		getDescription: getDescription
	}
}

var ReplaceFilter = function(replace, replaceWith) {
	var replace = replace;
	var replaceWith = replaceWith;
	var result = undefined;

	var process = function() {
		return result.replace(replace, replaceWith);
	}

	var setResult = function(previousResult) {
		result = previousResult;
		//console.log("new result:", result);
	}

	var getDescription = function() {
		return "Replace a substring with another (e.g. replace '...' with '!')";
	}

	return {
		process: process,
		setResult: setResult,
		getDescription: getDescription
	}
}

module.exports = {
	ConcatenationFilter: ConcatenationFilter,
	LowerCaseFilter: LowerCaseFilter,
	ReplaceFilter: ReplaceFilter
}

