goog.provide('Syncer');
goog.require('api.Bitbucket');
goog.require('utils.parser');



/**
 * @constructor
 */
var Syncer = function(url) {
	this._url = url;
	this._owner = null;
	this._redmineId = null;
	this._redmineTicket = null;
	this._api = {
		bitbucket: new api.Bitbucket
	};

	this.preload();
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


Syncer.prototype.preload = function() {
	utils.parser.redmine
		.getProjectId()
		.then(function(redmineId) {
			this._redmineId = redmineId;
		}.bind(this))
		.then(function() {
			chrome.storage.sync.get(null, function(items) {
				var settings = JSON.parse(items.settings);
				for (var owner in settings) if (settings.hasOwnProperty(owner)) {
					for (var redmineId in settings[owner]) if (settings[owner].hasOwnProperty(redmineId)) {
						if (redmineId === this._redmineId) {
							this._bitbucketRepo = settings[owner][redmineId];
							break;
						}
					}
					if (this._bitbucketRepo) {
						this._owner = owner;
						break;
					}
				}
				if (this._bitbucketRepo && this._owner) {
					this._api.bitbucket.setOwner(this._owner);

				}
			}.bind(this));
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
