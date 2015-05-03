var ConcatenationFilter = function() {

	var process = function(text, otherText) {
		return text + " " + otherText;
	}

	return {
		process: process
	}
}

var SearchFilter = function() {
	var process = function(needle, haystack) {
		return haystack.indexOf(needle);
	}

	return {
		process: process
	}
}

module.exports = {
	ConcatenationFilter: ConcatenationFilter,
	SearchFilter: SearchFilter
}

