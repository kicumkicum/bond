goog.provide('Application');
goog.require('service.Syncer');
goog.require('provider.Settings');
goog.require('config');


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
};


/**
 * @param {number} ticket
 * @param {string} redmineProjectId
 * @protected
 */
Application.prototype._loadData = function(ticket, redmineProjectId) {
	this._services.syncer
		.getBitbucketInfo(redmineProjectId)
		.then(function(bitbucketInfo) {
			this._data[ticket] = {
				bitbucketInfo: bitbucketInfo
			};

			return Promise.all([
				this._services.syncer.getBitbucketPullRequests({ticket: ticket}, bitbucketInfo),
				this._services.syncer.getBitbucketBranches(bitbucketInfo.owner, bitbucketInfo.repo)
			])
		}.bind(this))
		.then(function(result) {
			this._data[ticket].pullrequests = result[0];
			this._data[ticket].branches = result[1];
		}.bind(this));
};


/**
 * @protected
 */
Application.prototype._init = function() {
	chrome.tabs.onUpdated.addListener(this._onTabUpdate.bind(this));
};


/**
 * @param {number} tabId
 * @param {Object} changeInfo
 * @param {Object} tab
 * @private
 */
Application.prototype._onTabUpdate = function(tabId, changeInfo, tab) {
	if (changeInfo.status === chrome.tabs.TabStatus.COMPLETE) {
		return;
	}

	var url = tab.url;
	var isRedmine = utils.parser.isRedmine(url);
	var isBitbucket = utils.parser.isBitbucket(url);

	if (isRedmine) {
		this._addPullRequestsList(tabId, url);
	} else if (isBitbucket) {
		var isPullrequestsPage = url.indexOf('pull-requests') !== -1;
		if (isPullrequestsPage) {
			this._highlightTicketNumber(tabId);
		}
	}
};


/**
 * @param {number} tabId
 * @param {string} url
 * @protected
 */
Application.prototype._addPullRequestsList = function(tabId, url) {
	chrome.tabs.executeScript(tabId, {file: '/src/injections/create-pull-request-list.js'}, function() {
		if (chrome.extension.lastError) {
			var message = 'There was an error injecting script : \n' + chrome.extension.lastError.message;
			console.log(message);
		}
	});

	var ticket = utils.parser.getTicket(url);
	utils.parser
		.getRedmineProjectId(url)
		.then(this._loadData.bind(this, ticket))
		.then(this._injectPullRequestsToList.bind(this, tabId));
};


/**
 * @param {number} tabId
 * @param {Application.TabData} tabData
 * @private
 */
Application.prototype._injectPullRequestsToList = function(tabId, tabData) {
	var pullrequests = tabData.pullrequests;
	chrome.tabs.executeScript(tabId, {
		code: 'var pullrequests=' + JSON.stringify(pullrequests)

	}, function() {
		chrome.tabs.executeScript(tabId, {
			file: '/src/injections/add-pull-requests.js'

		}, function() {
			if (chrome.extension.lastError) {
				var message = 'There was an error injecting script : \n' + chrome.extension.lastError.message;
				console.log(message);
			}
		});
	});
};


/**
 * @param {number} tabId
 * @protected
 */
Application.prototype._highlightTicketNumber = function(tabId) {
	chrome.tabs.executeScript(tabId, {
		code: 'var redmineUrl = "http://' + config.redmine.host + '/issues/";'
	}, function() {
		chrome.tabs.executeScript(tabId, {file: '/src/injections/parse-pull-request-title.js'}, function() {
			if (chrome.extension.lastError) {
				var message = 'There was an error injecting script : \n' + chrome.extension.lastError.message;
				console.log(message);
			}
		});
	});
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
 *      pullrequests: (Array.<string>|undefined)
 * }}
 */
Application.TabData;
