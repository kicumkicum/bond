window.getAllElementsWithAttribute = function(attribute, opt_context) {
	var matchingElements = [];
	var allElements = (opt_context || document).getElementsByTagName('*');

	for (var i = 0, n = allElements.length; i < n; i++) {
		if (allElements[i].getAttribute(attribute) !== null) {
			matchingElements.push(allElements[i].getAttribute(attribute));
		}
	}

	console.log(matchingElements);
	return matchingElements;
};

chrome.extension.sendMessage({
	action: "get-branches",
	source: getAllElementsWithAttribute('data-branch-name')
});
