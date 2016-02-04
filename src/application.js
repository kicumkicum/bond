goog.provide('Application');
goog.require('service.Syncer');
goog.require('provider.Settings');



/**
 * @constructor
 */
var Application = function() {
	this._data = {};
	this._providers = {
		settings: new provider.Settings
	};

	this._services = {
		syncer: new service.Syncer(this._providers.settings)
	};

	this._init();
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
	chrome.extension.onMessage.addListener(function() {
		console.log(arguments);
	});

	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
		var url = tab.url;
		var isRedmine = utils.parser.isRedmine(url);
		var isBitbucket = utils.parser.isBitbucket(url);

		if (isRedmine) {
			utils.parser
				.getRedmineProjectId(url)
				.then(function(redmineProjectId) {
					return this._services.syncer.getBitbucketInfo(redmineProjectId);
				}.bind(this))
				.then(function(bitbucketInfo) {
					var ticket = utils.parser.getTicket(url);
					this.setData(ticket, bitbucketInfo);
					this.addTab(ticket);
				}.bind(this));
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
