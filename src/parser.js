/**
 * Created by oleg on 08.07.15.
 */
Parser = {};

Parser.getTiket = function(url) {
	var mask = 'dev.ifaced.ru/issues/';
	var pos = url.indexOf(mask) + mask.length;
	var ticket = '';
	if (url.indexOf(mask) !== 0) {
		ticket = url.substr(pos);
	}
	return ticket;
};

Parser.getBranch = function(url) {
	return 'localhost';
};

Parser.getPull = function(url) {

	return 'localhost';
};
