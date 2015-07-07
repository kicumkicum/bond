/**
 * Created by oleg on 08.07.15.
 */



/**
 * @constructor
 */
Syncer = function() {
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
	return 'https://bitbucket.org';
};


/**
 * @type {string}
 */
Syncer.prototype._url;
