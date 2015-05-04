var ConcatenationFilter = function(text, otherText) {
	var text = text;
	var otherText = otherText;

	var process = function() {
		return text + " " + otherText;
	}

	return {
		process: process
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

	var getType = function() {
		return "LowerCaseFilter";
	}

	return {
		process: process,
		setResult: setResult,
		getType: getType
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

	var getType = function() {
		return "ReplaceFilter";
	}

	return {
		process: process,
		setResult: setResult,
		getType: getType
	}
}

module.exports = {
	ConcatenationFilter: ConcatenationFilter,
	LowerCaseFilter: LowerCaseFilter,
	ReplaceFilter: ReplaceFilter
}

