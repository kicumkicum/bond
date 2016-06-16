goog.provide('api.Bitbucket');
goog.require('api.AbstractApi');
goog.require('config');
goog.require('models.bitbucket.Branch');
goog.require('models.bitbucket.PullRequest');
goog.require('models.bitbucket.Repository');
goog.require('utils.parser');



/**
 * @constructor
 * @extends {api.AbstractApi}
 */
api.Bitbucket = function() {
	this._url = 'https://bitbucket.org/api/2.0/';
	this._realUrl = 'https://bitbucket.org';
	this._maxPageLength = 50;
};
goog.inherits(api.Bitbucket, api.AbstractApi);


/**
 * @param {string} url
 * @param {Object} headers
 * @return {IThenable<Array<*>>}
 */
api.Bitbucket.prototype.cyclicalRequest = function(url, headers) {
	var result = [];
	var request = function(url) {
		return this._request(url)
			.then(function(response) {
				result = result.concat(response['values']);

				if (response['next']) {
					return request(response['next']);
				} else {
					return result;
				}
			}.bind(this));
	}.bind(this);

	return request(url);
};


/**
 * @param {string} owner
 * @param {string} repoName
 * @return {IThenable.<Array.<models.bitbucket.Branch>>}
 */
api.Bitbucket.prototype.getBranches = function(owner, repoName) {
	return this.getRepo(owner, repoName)
		.then(function(repo) {
			return this.cyclicalRequest(repo.links.branches.href);
		}.bind(this));
};


/**
 * @return {IThenable.<models.bitbucket.PullRequest>}
 */
api.Bitbucket.prototype.getPullRequests = function(owner, repo) {
	var url = this._url + 'repositories/' + owner + '/' + repo + '/pullrequests/?state=merged,open' +
		'&pagelen=' + this._maxPageLength;
	var httpHeader = {'Authorization': 'Basic ' + config.token};

	var request = function(url) {
		return this
			.request(url, httpHeader)
			.then(function(response) {
				var responsePulls = response['values'].map(function(pull) {
					return new models.bitbucket.PullRequest(pull);
				});
				var responsePullLength = responsePulls.length;

				responsePulls = responsePulls.filter(function(responsePull) {
					return this._cachedPulls.every(function(pull) {
						return pull.id !== responsePull.id;
					});
				}, this);

				this._cachedPulls = this._cachedPulls.concat(responsePulls);

				if (responsePullLength === responsePulls.length) {
					return response['next'];
				}
			}.bind(this))
			.then(function(url) {
				if (url) {
					return request(url, httpHeader);
				} else {
					return this._cachedPulls;
				}
			}.bind(this));
	}.bind(this);

	return request(url);
};


/**
 * @param {string} owner
 * @return {IThenable<Array>}
 */
api.Bitbucket.prototype.getRepositories = function(owner) {
	var url = this._url + 'teams/' + owner + '/repositories';
	var httpHeader = {'Authorization': 'Basic ' + config.token};

	return this.cyclicalRequest(url, httpHeader)
		.then(function(response) {
			return response.map(function(repo) {
				return new models.bitbucket.Repository(repo);
			});
		});
};


/**
 * @param {string} owner
 * @param {string} repo
 * @return {IThenable<models.bitbucket.Repository>}
 */
api.Bitbucket.prototype.getRepo = function(owner, repo) {
	var url = this._createUrl(this._url, 'repositories', owner, repo);
	return this._request(url)
		.then(function(data) {
			return new models.bitbucket.Repository(data);
		});
};


/**
 * @param {string} url
 * @return {IThenable<*>}
 * @private
 */
api.Bitbucket.prototype._request = function(url) {
	var httpHeader = {'Authorization': 'Basic ' + config.token};
	return this.request(url, httpHeader);
};


/**
 * @type {Array<models.bitbucket.PullRequest>}
 */
api.Bitbucket.prototype._cachedPulls = [];
