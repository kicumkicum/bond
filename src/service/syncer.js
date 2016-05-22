goog.provide('service.Syncer');
goog.require('api.Bitbucket');
goog.require('api.Redmine');
goog.require('config');
goog.require('utils.parser');



/**
 * @param {provider.Settings} settings
 * @constructor
 */
service.Syncer = function(settings) {
	this._settings = settings;

	this._url = null;
	this._owner = null;
	this._redmineId = null;
	this._redmineTicket = null;
	this._api = {
		bitbucket: new api.Bitbucket,
		redmine: new api.Redmine
	};

	this.load();
};
goog.inherits(service.Syncer, EventEmitter);


/**
 */
service.Syncer.prototype.goToRedmineTicket = function() {
	this.getRedMineTicketUrl().then(this._goto.bind(this));
};


/**
 * @return {IThenable.<string>}
 */
service.Syncer.prototype.getRedMineTicketUrl = function(bitbucketUrl) {
	return new Promise(function(resolve, reject) {
		var ticket = utils.parser.findTicket(bitbucketUrl);
		var ticketUrl = utils.parser.joinUrl('https://', this._settings.getRedmineHost(), 'issues', ticket);
		resolve(ticketUrl);
	}.bind(this));
};


/**
 * @return {IThenable.<Array.<models.bitbucket.Branch>>}
 */
service.Syncer.prototype.getBitbucketBranches = function(owner, repo) {
	return this._api.bitbucket.getBranches(owner, repo);
};


/**
 * @return {IThenable.<string>}
 */
service.Syncer.prototype.getBitbucketPullRequestUrl = function() {
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
 * @param {{
 *      ticket: string
 * }} redmine
 * @param {service.Syncer.BitbucketInfo} bitbucket
 * @return {IThenable.<Array.<models.bitbucket.PullRequest>>}
 */
service.Syncer.prototype.getBitbucketPullRequests = function(redmine, bitbucket) {
	return this._api.bitbucket
		.getPullRequests(bitbucket.owner, bitbucket.repo)
		.then(function(pulls) {
			return pulls.filter(function(pull) {
				var isTargetPullRequest = pull.title.indexOf(redmine.ticket) !== -1;
				var isTargetBranch = pull.source.branch.name.indexOf(redmine.ticket) !== -1;

				return isTargetPullRequest || isTargetBranch;
			}, this);
		}.bind(this));
};


/**
 * @return {Array.<models.bitbucket.PullRequest>}
 */
service.Syncer.prototype.getBitbucketPullRequestsSync = function() {
	return this._pullrequests;
};


/**
 * @param {string} token
 */
service.Syncer.prototype.setBitbucketToken = function(token) {
	this._token.bitbucket = token;
};


/**
 * @return {Promise.<string>}
 */
service.Syncer.prototype.getRedmineProjectId = function() {
	return utils.parser.redmine.getProjectId();
};


/**
 */
service.Syncer.prototype.load = function() {
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
						return this._loadBitbucketInfo();
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
service.Syncer.prototype.getCurrentUrl = function() {
	return new Promise(function(resolve, reject) {
		chrome.tabs.getSelected(function(tab) {
			tab.url ? resolve(tab.url) : reject('no-url');
		});
	});
};


/**
 * @deprecated
 * @use utils.parser.isBitbucket
 * @return {boolean}
 */
service.Syncer.prototype.isBitbucket = function() {
	return this._url.indexOf('https://bitbucket.org') !== -1 || this._url.indexOf('http://bitbucket.org') !== -1;
};


/**
 * @deprecated
 * @use utils.parser.isRedmine()
 * @return {boolean}
 */
service.Syncer.prototype.isRedmine = function() {
	return this._url.indexOf('https://' + config.redmine.host) !== -1 || this._url.indexOf('http://' + config.redmine.host) !== -1;
};


/**
 * @param currentRedmineProjectId
 * @return {Promise.<service.Syncer.BitbucketInfo>}
 */
service.Syncer.prototype.getBitbucketInfo = function(currentRedmineProjectId) {
	return new Promise(function(resolve, reject) {
		chrome.storage.sync.get(null, function(items) {
			var bitbucketInfo = {};
			var settings = JSON.parse(items.settings.sync);

			for (var owner in settings) if (settings.hasOwnProperty(owner)) {
				for (var redmineId in settings[owner]) if (settings[owner].hasOwnProperty(redmineId)) {

					if (redmineId === currentRedmineProjectId) {
						bitbucketInfo.repo = settings[owner][redmineId];
						break;
					}
				}

				if (bitbucketInfo.repo) {
					bitbucketInfo.owner = owner;
					return resolve(bitbucketInfo);
				}
			}
		}.bind(this));
	}.bind(this));
};


/**
 * @param {string} url
 * @protected
 */
service.Syncer.prototype._goto = function(url) {
	window.open(url);
};


/**
 * @return {Promise.<undefined>}
 * @protected
 */
service.Syncer.prototype._loadBitbucketInfo = function() {
	return new Promise(function(resolve, reject) {
		chrome.storage.sync.get(null, function(items) {
			var settings = JSON.parse(items.settings.sync);
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
			resolve();
		}.bind(this));
	}.bind(this));
};


/**
 * @type {provider.Settings}
 */
service.Syncer.prototype._settings;


/**
 * @type {string}
 */
service.Syncer.prototype._url;


/**
 * @type {string}
 */
service.Syncer.prototype._redmineTicket;


/**
 * @type {string}
 */
service.Syncer.prototype._bitbucketRepo;


/**
 * @type {Array.<models.bitbucket.PullRequest>}
 */
service.Syncer.prototype._pullrequests;


/**
 * @type {string}
 */
service.Syncer.prototype._owner;


/**
 * @type {{
 *      bitbucket: string,
 *      redmine: string
 * }}
 */
service.Syncer.prototype._token;


/**
 * @type {{
 *      bitbucket: api.Bitbucket,
 *      redmine: api.Redmine
 * }}
 */
service.Syncer.prototype._api;


/**
 * @typedef {{
 *      owner: string,
 *      repo: string
 * }}
 */
service.Syncer.BitbucketInfo;
