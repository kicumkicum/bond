goog.provide('utils.tab');


utils.tab.getCurrentUrl = function() {
	return new Promise(function(resolve, reject) {
		chrome.tabs.getSelected(function(tab) {
			tab.url ? resolve(tab.url) : reject('no-url');
		});
	});
};


/**
 * @param {string} url
 * @return {IThenable.<*>}
 */
utils.tab.getChromeTabByUrl = function(url) {
	return new Promise(function(resolve, reject) {
		chrome.windows.getCurrent(function(chromeWindow) {
			chrome.tabs.query({'windowId': chromeWindow.id}, function(tabs) {
				var tab = tabs.filter(function(tab) {
					return tab.url === url;
				})[0];

				tab ? resolve(tab) : reject('not find tab by url: ' + url);
			});
		});
	});
};


/**
 * @param {utils.tab.Injections} injection
 * @param {*} chromeTab
 * @return {IThenable.<*>}
 */
utils.tab.inject = function(injection, chromeTab) {
	return new Promise(function(resolve, reject) {
		var listener = function(request, sender) {
			if (request.action === injection) {
				chrome.extension.onMessage.removeListener(listener);
				resolve(request.source);
			}
		};

		chrome.extension.onMessage.addListener(listener);
		chrome.tabs.executeScript(chromeTab.id, {file: '/src/injections/' + injection + '.js'}, function() {
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
