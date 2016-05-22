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
		return this.request(url, headers)
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
 * @param {string} repo
 * @return {IThenable.<Array.<models.bitbucket.Branch>>}
 */
api.Bitbucket.prototype.getBranches = function(owner, repo) {
	var getBranches = function(tabId) {
		chrome.tabs.executeScript(tabId, {file: "/src/injections/get-branches-from-page.js"}, function() {
			if (chrome.extension.lastError) {
				var message = 'There was an error injecting script : \n' + chrome.extension.lastError.message;
				console.log('error', message);
			}
		});
	};

	//todo http://stackoverflow.com/questions/11684454/getting-the-source-html-of-the-current-page-from-chrome-extension
	var url = utils.parser.joinUrl(this._realUrl, owner, repo, 'branches');

	//window.open(url);
	//chrome.tabs.query({'url': url}, function(tabs) {
	//	getBranches(tabs[0].id);
	//});

	return this.getHTML(url)
		.then(function(html) {
			return utils.parser.getBranchesFromHTML(html);
		})
		.then(function(branchesNames) {
			return branchesNames.map(function(branchName) {
				var url = utils.parser.joinUrl(this._realUrl, owner, repo, 'branch', branchName);
				return new models.bitbucket.Branch({
					name: branchName,
					links: {
						html: {
							href: url
						}
					}
				});
			}, this);
		}.bind(this));
	//chrome.cookies.getAll({domain: 'bitbucket.org'}, function(cookies) {
	//	console.log(cookies);
	//	for (var i = 0; i < cookies.length; i++) {
	//		var newCookie = {
	//			'url': "http" + (cookies[i].secure ? "s" : "") + "://" + cookies[i].domain + cookies[i].path,
	//			'name': cookies[i].name,
	//			'value': cookies[i].value,
	//			'domain': cookies[i].domain,
	//			'path': cookies[i].path,
	//			'secure': cookies[i].secure,
	//			'httpOnly': cookies[i].httpOnly,
	//			'expirationDate': cookies[i].expirationDate,
	//			'storeId': cookies[i].storeId
	//		};
	//		chrome.cookies.set(newCookie);
	//	}
	//	return this.getHTML(url)
	//		.then(function(html) {
	//			console.log(html);
	//			return this.getAllElementsWithAttribute('data-branch-name', doc);
			//}.bind(this));
	//}.bind(this));


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
					})
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
 * @type {Array<models.bitbucket.PullRequest>}
 */
api.Bitbucket.prototype._cachedPulls = [];
