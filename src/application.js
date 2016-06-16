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
 * @return {IThenable<Application.TabData>}
 * @protected
 */
Application.prototype._loadData = function(ticket, redmineProjectId) {
	return this._services.syncer
		.getBitbucketInfo(redmineProjectId)
		.then(function(bitbucketInfo) {
			this._data[ticket] = {
				bitbucketInfo: bitbucketInfo
			};

			return Promise.all([
				this._services.syncer.getBitbucketPullRequests({ticket: ticket}, bitbucketInfo),
				this._services.syncer.getBitbucketBranches(bitbucketInfo.owner, bitbucketInfo.repo, ticket.toString())
			]);
		}.bind(this))
		.then(function(result) {
			this._data[ticket].pullrequests = result[0];
			this._data[ticket].branches = result[1];

			return this._data[ticket];
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
	if (changeInfo.status !== chrome.tabs.TabStatus.LOADING) {
		return;
	}

	var url = tab.url;
	var isRedmine = utils.parser.isRedmine(url);
	var isBitbucket = utils.parser.isBitbucket(url);

	if (isRedmine) {
		var issue = utils.parser.getTicket(url);
		return utils.parser
			.getRedmineProjectId(url)
			.then(this._loadData.bind(this, issue))
			.then(function() {
				this._injectCreateBranchButton(tabId, issue, (this._data[issue] || {}).bitbucketInfo, (this._data[issue] || {}).branches);
				setTimeout(function() {
					this._addPullRequestsList(tabId, url);
				}.bind(this), 300);
			}.bind(this));

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
	var ticket = utils.parser.getTicket(url);
	return this._injectPullRequestsToList(tabId, this._data[ticket] || {});
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
 * @param {number} issue
 * @param {service.Syncer.BitbucketInfo} bitbucketInfo
 * @private
 */
Application.prototype._injectCreateBranchButton = function(tabId, issue, bitbucketInfo, branches) {
	chrome.tabs.executeScript(tabId, {
		code: 'var issue = ' + issue + ', bitbucketInfo = ' + JSON.stringify(bitbucketInfo) + ', branches = ' + JSON.stringify(branches)
	}, function() {
		chrome.tabs.executeScript(tabId, {
			file: '/src/injections/create-branch-list.js'

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
 * @type {Application.TabData}
 */
Application.prototype._data;


/**
 * @typedef {Object.<string, {
 *      ticket: (string|undefined),
 *      branches: (Array.<string>|undefined),
 *      pullrequests: (Array.<string>|undefined)
 * }>}
 */
Application.TabData;
