goog.provide('Syncer');
goog.require('api.Bitbucket');
goog.require('utils.parser');


/**
 * @constructor
 */
var Syncer = function() {
	this._url = '';
	this._api = {};
	this._api.bitbucket = new api.Bitbucket;
};


/**
 * @param {string} url
 */
Syncer.prototype.setUrl = function(url) {
	this._url = url;
	this._redmineTicket = utils.parser.getTicket(url);
};


/**
 * @return {string}
 */
Syncer.prototype.getRedMineTicketUrl = function() {
	return 'https://dev.ifaced.ru'
};


/**
 * @return {string}
 */
Syncer.prototype.getBitbucketBranchUrl = function() {
	return 'https://bitbucket.org';
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
				return pull.title.indexOf(this._redmineTicket) !== -1;
			}, this);
			return pullUrl[0].links.html.href;
		}.bind(this));
};


Syncer.prototype.setBitbucketToken = function(token) {
	this._token.bitbucket = token;
};

/**
 * @type {string}
 */
Syncer.prototype._url;


/**
 * @type {{
 *      bitbucket: string,
 *      redmine: string
 * }}
 */
Syncer.prototype._token;