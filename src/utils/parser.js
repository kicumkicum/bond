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

utils.parser.getBranch = function(url) {
	return 'localhost';
};

utils.parser.getPull = function(url) {
	return 'localhost';
};
