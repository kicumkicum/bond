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

	this._init();
};


/**
 */
Syncer.prototype.goToRedmineTicket = function() {
	this.getRedMineTicketUrl().then(this._goto.bind(this));
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
 * @return {IThenable.<Array.<models.bitbucket.PullRequest>>}
 */
Syncer.prototype.getBitbucketPullRequests = function() {
	return this._api.bitbucket
		.getPullRequests()
		.then(function(pulls) {
			return pulls.filter(function(pull) {
				var isTargetPullRequest = pull.title.indexOf(this._redmineTicket) !== -1;
				var isTargetBranch = pull.source.branch.name.indexOf(this._redmineTicket) !== -1;
				return isTargetPullRequest || isTargetBranch;
			}, this);
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


Syncer.prototype._init = function() {
	chrome.storage.sync.get(null, function(items) {
		var settings = JSON.parse(items.settings);

		Object.keys(settings).forEach(function(el, i) {
			this._api.bitbucket.setOwner(el);

			for (var prop in settings[el]) {
				this._api.bitbucket.setRepo(settings[el][prop]);
			}
		}, this);
	}.bind(this));
};


/**
 * @param {string} url
 * @protected
 */
Syncer.prototype._goto = function(url) {
	window.open(url);
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
