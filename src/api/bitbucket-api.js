goog.provide('api.Bitbucket');
goog.require('api.AbstractApi');
goog.require('models.bitbucket.PullRequest');


/**
 * @constructor
 * @extends {api.AbstractApi}
 */
api.Bitbucket = function() {
	this._url = 'https://bitbucket.org/api/2.0/';
	this._owner = 'interfaced';
	this._repoSlug = 'persik.by';
	this._maxPageLength = 50;

};
goog.inherits(api.Bitbucket, api.AbstractApi);


api.Bitbucket.prototype.getBranches = function() {
	var url = 'https://bitbucket.org/interfaced/persik.by/branches';

	//window.open(url);
	chrome.tabs.query({'url': url}, function(tab) {
		console.log(arguments);
		chrome.tabs.executeScript(tab[0].id, {code: 'var w = window; console.log(w);'});
	})

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


