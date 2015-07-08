goog.provide('Syncer');


/**
 * @constructor
 */
var Syncer = function() {
	this._url = '';
};


/**
 * @param {string} url
 */
Syncer.prototype.setUrl = function(url) {
	this._url = url;
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
 * @return {string}
 */
Syncer.prototype.getBitbucketPullRequestUrl = function() {
	return 'https://bitbucket.org/api/1.0/user/repositories/';
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