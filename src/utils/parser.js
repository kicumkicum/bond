goog.provide('utils.parser');


utils.parser = {};

utils.parser.getTicket = function(url) {
	var mask = 'dev.ifaced.ru/issues/';
	var pos = url.indexOf(mask) + mask.length;
	var ticket = '';
	if (url.indexOf(mask) !== 0) {
		ticket = url.substr(pos);
	}
	return ticket;
};


/**
 * @param {string} html
 * @return {Array.<string>}
 */
utils.parser.getBranchesFromHTML = function(html) {
	var result;
	var textBlocks = [];
	var exp = /(?:data-branch-name=")(.*)(?:">)/g;

	while (result = exp.exec(html)) {
		textBlocks.push(result[1]);
	}

	return textBlocks;
};


utils.parser.getBranch = function(url) {
	return 'localhost';
};

utils.parser.getPull = function(url) {
	return 'localhost';
};


/**
 * @args {string}
 * @return {string}
 */
utils.parser.joinUrl = function() {
	return Array.prototype.join.call(arguments, '/').replace('//', '/');
};


/**
 * @param {string} url
 * @return {string}
 */
utils.parser.findTicket = function(url) {
	var exp = /(((pull-request|branch).*(hotfix|feature|release)\D*)([0-9]*))/;

	var ticketExp = exp.exec(url);
	return ticketExp && ticketExp[5];
};
