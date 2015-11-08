goog.provide('utils.parser');
goog.require('config');
goog.require('utils.tab');


utils.parser = {};
utils.parser.redmine = {};

/**
 * @param {string} redmineUrl
 * @return {string}
 */
utils.parser.getTicket = function(redmineUrl) {
	var mask = config.redmine.host + '/issues/';
	var pos = redmineUrl.indexOf(mask) + mask.length;
	var ticket = '';
	if (redmineUrl.indexOf(mask) !== 0) {
		ticket = redmineUrl.substr(pos);
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


/**
 * @deprecated
 * @see utils.parser.getRedmineProjectId
 * @return {Promise.<string>}
 */
utils.parser.redmine.getProjectId = function() {
	return new Promise(function(resolve, reject) {
		var listener = function(request, sender) {
			if (request.action === 'get-redmine-project-id') {
				chrome.extension.onMessage.removeListener(listener);
				resolve(request.source);
			}
		};

		chrome.extension.onMessage.addListener(listener);
		chrome.tabs.executeScript(null, {file: "/src/injections/get-redmine-project-id.js"}, function() {
			if (chrome.extension.lastError) {
				var message = 'There was an error injecting script : \n' + chrome.extension.lastError.message;
				chrome.extension.onMessage.removeListener(listener);
				reject('error:', message);
			}
		});
	});
};


/**
 * @param {string} redmineUrl
 * @return {IThenable.<string>}
 */
utils.parser.getRedmineProjectId = function(redmineUrl) {
	return utils.tab
		.getChromeTabByUrl(redmineUrl)
		.then(function(tab) {
			if (!tab) {
				return Promise.reject('tab not find');
			}

			return utils.tab.inject(utils.tab.Injections.GET_REDMINE_PROJECT_ID, tab);
		});

};
