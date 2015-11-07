goog.provide('Application');
goog.require('service.Syncer');
goog.require('provider.Settings');



/**
 * @constructor
 */
var Application = function() {
	this._providers = {
		settings: new provider.Settings
	};

	this._services = {
		syncer: new service.Syncer(this._providers.settings)
	};

	this._init();
};


Application.prototype.addTab = function(tab) {
	var url = tab.url;

	return Promise.all([
		this.getPullRequests.bind(this, url),
		this.getBranches.bind(this, url),
		this.getRedmineTicket.bind(this, url)
	])
		.then(function(pullRequests, branches, ticket) {
			this._tabs[url] = {
				ticket: ticket,
				branches: branches,
				pullRequests: pullRequests
			};

			return this._tabs[url];
		}.bind(this));
};


/**
 * @param {string} redmineUrl
 * @return {IThenable.<Array.<>>}
 */
Application.prototype.getPullRequests = function(redmineUrl) {
	return new Promise(function(resolve, reject) {

	});
};


/**
 * @param {string} redmineUrl
 * @return {IThenable.<Array.<>>}
 */
Application.prototype.getBranches = function(redmineUrl) {
	return new Promise(function(resolve, reject) {

	});
};


/**
 * @param {string} bitbucketUrl
 * @return {IThenable.<string>}
 */
Application.prototype.getRedmineTicket = function(bitbucketUrl) {
	return new Promise(function(resolve, reject) {

	});
};


/**
 * @protected
 */
Application.prototype._init = function() {
	chrome.extension.onMessage.addListener(function() {
		console.log(arguments);
	});

	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
		chrome.tabs.getSelected(null, function(tab) {
			this.addTab(tab);
		}.bind(this));
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
 * @typedef {{
 *      ticket: (string|undefined),
 *      branches: (Array.<string>|undefined),
 *      pullRequests: (Array.<string>|undefined)
 * }}
 */
Application.TabData;
