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

module.exports = ConcatenationFilter;