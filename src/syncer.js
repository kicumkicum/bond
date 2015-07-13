goog.provide('Syncer');
goog.require('api.Bitbucket');
goog.require('utils.parser');



/**
 * @constructor
 */
var Syncer = function() {
	this._url = '';
	this._api = {
		bitbucket: new api.Bitbucket
	};
};


/**
 * @param {string} url
 */
Syncer.prototype.setUrl = function(url) {
	this._url = url;
	this._redmineTicket = utils.parser.getTicket(url);
};


/**
 * @return {IThenable.<string>}
 */
Syncer.prototype.getRedMineTicketUrl = function() {
	return new Promise(function(resolve, reject) {
		chrome.tabs.getSelected(function(tab) {
			var tabUrl = tab.url;
			var ticket = utils.parser.findTicket(tabUrl);
			var ticketUrl = utils.parser.joinUrl('https://dev.ifaced.ru/issues', ticket);
			resolve(ticketUrl);
		});
	});
};


/**
 * @return {Array.<models.bitbucket.Branch>}
 */
Syncer.prototype.getBitbucketBranches = function() {
	return this._api.bitbucket.getBranches();
};


/**
 * @return {IThenable.<string>}
 */
Syncer.prototype.getBitbucketPullRequestUrl = function() {
	return this._api.bitbucket
		.getPullRequests()
		.then(function(pulls) {
			var pullUrl = pulls.filter(function(pull) {
				pull = /** @type {models.bitbucket.PullRequest} */(pull);
				return pull.title.indexOf(this._redmineTicket) !== -1 ||
					pull.source.branch.name.indexOf(this._redmineTicket) !== -1;
			}, this);
			return pullUrl[0].links.html.href;
		}.bind(this));
};


/**
 * @param {string} token
 */
Syncer.prototype.setBitbucketToken = function(token) {
	this._token.bitbucket = token;
};


/**
 * @return {Promise.<string>}
 */
Syncer.prototype.getRedmineProjectId = function() {
	return utils.parser.redmine.getProjectId();
};


/**
 * @type {string}
 */
Syncer.prototype._url;


/**
 * @type {string}
 */
Syncer.prototype._redmineTicket;


/**
 * @type {{
 *      bitbucket: string,
 *      redmine: string
 * }}
 */
Syncer.prototype._token;


/**
 * @type {{
 *      bitbucket: api.Bitbucket
 * }}
 */
Syncer.prototype._api;
