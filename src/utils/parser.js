goog.provide('utils.Parser');


utils.Parser = function() {};

utils.Parser.getTicket = function(url) {
	var mask = 'dev.ifaced.ru/issues/';
	var pos = url.indexOf(mask) + mask.length;
	var ticket = '';
	if (url.indexOf(mask) !== 0) {
		ticket = url.substr(pos);
	}
	return ticket;
};

utils.Parser.getBranch = function(url) {
	return 'localhost';
};

utils.Parser.getPull = function(url) {
	return 'localhost';
};
