goog.provide('utils.tab');



utils.tab = {};


/**
 * @param {string} url
 * @return {IThenable.<*>}
 */
utils.tab.getChromeTabByUrl = function(url) {
	return new Promise(function(resolve, reject) {
		chrome.tabs.query({'windowId': 0}, function(tabs) {
			var tab = tabs.filter(function(tab) {
				return tab.url === url;
			})[0];

			resolve(tab);
		})
	});
};


/**
 * @param {utils.tab.Injections} injection
 * @return {IThenable.<*>}
 */
utils.tab.inject = function(injection) {
	return new Promise(function(resolve, reject) {
		var listener = function(request, sender) {
			if (request.action === injection) {
				chrome.extension.onMessage.removeListener(listener);
				resolve(request.source);
			}
		};

		chrome.extension.onMessage.addListener(listener);
		chrome.tabs.executeScript(tab.id, {file: '/src/injections/' + injection + '.js'}, function() {
			if (chrome.extension.lastError) {
				var message = 'There was an error injecting script : \n' + chrome.extension.lastError.message;
				chrome.extension.onMessage.removeListener(listener);

				reject('error:', message);
			}
		});
	});
};


/**
 * @enum {string}
 */
utils.tab.Injections = {
	GET_REDMINE_PROJECT_ID: 'get-redmine-project-id'
};
