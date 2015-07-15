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

	this.load();
};
goog.inherits(Syncer, EventEmitter);


/**
 */
Syncer.prototype.goToRedmineTicket = function() {
	this.getRedMineTicketUrl().then(this._goto.bind(this));
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
 * @return {IThenable.<Array.<models.bitbucket.Branch>>}
 */
Syncer.prototype.getBitbucketBranches = function() {
	return this._api.bitbucket.getBranches(this._owner, this._bitbucketRepo);
};


/**
 * @return {IThenable.<string>}
 */
Syncer.prototype.getBitbucketPullRequestUrl = function() {
	return this._api.bitbucket
		.getPullRequests(this._owner, this._bitbucketRepo)
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
		.getPullRequests(this._owner, this._bitbucketRepo)
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


/**
 */
Syncer.prototype.load = function() {
	this.getCurrentUrl()
		.then(function(url) {
			this._url = url;
			this._redmineTicket = utils.parser.getTicket(url);
		}.bind(this))
		.then(function() {
			if (this.isRedmine()) {
				return utils.parser.redmine
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
						}.bind(this));
					}.bind(this));
			} else {
				return Promise.resolve();
			}
		}.bind(this))
		.then(function() {
			this.emit('load');
		}.bind(this));
};


/**
 * @return {Promise}
 */
Syncer.prototype.getCurrentUrl = function() {
	return new Promise(function(resolve, reject) {
		chrome.tabs.getSelected(function(tab) {
			tab.url ? resolve(tab.url) : reject('no-url');
		});
	});
};


/**
 * @return {boolean}
 */
Syncer.prototype.isBitbucket = function() {
	return this._url.indexOf('https://bitbucket.org') !== -1 || this._url.indexOf('http://bitbucket.org') !== -1;
};


/**
 * @return {boolean}
 */
Syncer.prototype.isRedmine = function() {
	return this._url.indexOf('https://dev.ifaced.ru') !== -1 || this._url.indexOf('http://dev.ifaced.ru') !== -1;
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
 * @type {string}
 */
Syncer.prototype._bitbucketRepo;


/**
 * @type {string}
 */
Syncer.prototype._owner;


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
