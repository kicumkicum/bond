goog.provide('api.Bitbucket');
goog.require('api.AbstractApi');
goog.require('models.bitbucket.Branch');
goog.require('models.bitbucket.PullRequest');
goog.require('utils.parser');


/**
 * @constructor
 * @extends {api.AbstractApi}
 */
api.Bitbucket = function() {
	this._url = 'https://bitbucket.org/api/2.0/';
	this._realUrl = 'https://bitbucket.org';
	this._owner = 'interfaced';
	this._repoSlug = 'persik.by';
	this._maxPageLength = 50;

};
goog.inherits(api.Bitbucket, api.AbstractApi);


api.Bitbucket.prototype.getBranches = function() {
	var getBranches = function(tabId) {
		chrome.tabs.executeScript(tabId, {file: "/src/utils/get-branches-from-page.js"}, function() {
			if (chrome.extension.lastError) {
				var message = 'There was an error injecting script : \n' + chrome.extension.lastError.message;
				console.log('error', message);
			}
		});
	};

	//todo http://stackoverflow.com/questions/11684454/getting-the-source-html-of-the-current-page-from-chrome-extension
	var url = utils.parser.joinUrl(this._realUrl, this._owner, this._repoSlug, 'branches');

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
				var url = utils.parser.joinUrl(this._realUrl, this._owner, this._repoSlug, 'branch', branchName);
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
api.Bitbucket.prototype.getPullRequests = function() {
	var url = this._url + 'repositories/' + this._owner + '/' + this._repoSlug + '/pullrequests/?state=merged,open' +
		'&pagelen=' + this._maxPageLength;
	var pulls = [];
	var httpHeader = {'Authorization': 'Basic a2ljdW1raWN1bToxMXpobG01'};

	var request = function(url) {
		return this
			.request(url, httpHeader)
			.then(function(response) {
				var responsePulls = response['values'].map(function(pull) {
					return new models.bitbucket.PullRequest(pull);
				});

				pulls = pulls.concat(responsePulls);
				return response['next'];
			})
			.then(function(url) {
				if (url) {
					return request(url, httpHeader);
				} else {
					return pulls;
				}
			});
	}.bind(this);

	return request(url);
};


/**
 * @param {string} owner
 */
api.Bitbucket.prototype.setOwner = function(owner) {
	this._owner = owner;
};


/**
 * @return {string}
 */
api.Bitbucket.prototype.getOwner = function() {
	return this._owner;
};


/**
 * @param {string} repo
 */
api.Bitbucket.prototype.setRepo = function(repo) {
	this._repo = repo;
};


/**
 * @return {string}
 */
api.Bitbucket.prototype.getRepo = function() {
	return this._repo;
};

