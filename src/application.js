goog.provide('Application');
goog.require('service.Syncer');
goog.require('provider.Settings');



/**
 * @constructor
 */
var Application = function() {
	window.app = this;
	this._data = {};
	utils.parser._data = this._data;
	this._providers = {
		settings: new provider.Settings
	};

	this._services = {
		syncer: new service.Syncer(this._providers.settings)
	};

	this._init();

	//var server = {
	//	'get-pullrequests': function(source, sendResponse) {
	//		var ticket = utils.parser.findTicket(source);
	//		sendResponse({pr: this._data[ticket].pullrequests});
	//	}.bind(this)
	//};
	//
	//chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	//	return server[request.action] && server[request.action].call(server, request.source, sendResponse);
	//});
};


/**
 * @param {string} ticket
 * @return {IThenable.<Application.TabData>}
 */
Application.prototype.addTab = function(ticket) {
	// TODO Rename this method
	return Promise.all([
		this._services.syncer.getBitbucketPullRequests({ticket: ticket}, this._data[ticket]),
		this._services.syncer.getBitbucketBranches(this._data[ticket].owner, this._data[ticket].repo)
	])
		.then(function(array) {
			this._data[ticket] = {
				pullrequests: array[0],
				branches: array[1]
			};

			return this._data[ticket];
		}.bind(this));
};


/**
 * @param {string} redmineTicket
 * @param {service.Syncer.BitbucketInfo} bitbucketInfo
 */
Application.prototype.setData = function(redmineTicket, bitbucketInfo) {
	this._data[redmineTicket] = bitbucketInfo;
};


/**
 * @protected
 */
Application.prototype._init = function() {
	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
		var url = tab.url;
		var isRedmine = utils.parser.isRedmine(url);
		var isBitbucket = utils.parser.isBitbucket(url);

		if (isRedmine) {
			chrome.tabs.executeScript(tabId, {file: '/src/injections/create-pull-request-list.js'}, function() {
				if (chrome.extension.lastError) {
					var message = 'There was an error injecting script : \n' + chrome.extension.lastError.message;
					console.log(message);
				}
			});

			utils.parser
				.getRedmineProjectId(url)
				.then(function(redmineProjectId) {
					return this._services.syncer.getBitbucketInfo(redmineProjectId);
				}.bind(this))
				.then(function(bitbucketInfo) {
					var ticket = utils.parser.getTicket(url);
					this.setData(ticket, bitbucketInfo);
					return this.addTab(ticket);
				}.bind(this))
				.then(function(tabData) {
					var pullrequests = tabData.pullrequests;
					chrome.tabs.executeScript(tabId, {
						code: 'var pullrequests=' + JSON.stringify(pullrequests)}, function() {
						chrome.tabs.executeScript(tabId, {
							file: '/src/injections/add-pull-requests.js'
						}, function() {
							if (chrome.extension.lastError) {
								var message = 'There was an error injecting script : \n' + chrome.extension.lastError.message;
								console.log(message);
							}
						});
					});
				});
		} else if (isBitbucket) {
			// TODO
		}
	}.bind(this));

};


/**
 * @type {Object.<string, ?Application.TabData>}
 */
Application.prototype._tabs;


/**
 * @type {{
 *      syncer: service.Syncer
 * }}
 */
Application.prototype._services;


/**
 * @type {{
 *      settings: provider.Settings
 * }}
 */
Application.prototype._providers;


/**
 * @type {Object.<string, service.Syncer.BitbucketInfo>}
 */
Application.prototype._data;


/**
 * @typedef {{
 *      ticket: (string|undefined),
 *      branches: (Array.<string>|undefined),
 *      pullRequests: (Array.<string>|undefined)
 * }}
 */
Application.TabData;
