goog.provide('models.bitbucket.Links');
goog.require('models.Abstract');



/**
 * @param {Object} data
 * @constructor
 */
models.bitbucket.Links = function(data) {
	goog.base(this, data);
	console.log(data);
};
goog.inherits(models.bitbucket.Links, models.Abstract);


/**
 * @override
 */
models.bitbucket.Links.prototype.parse = function(data) {
	if (data['html']) {
		this.html = this._parseHref(data['html']);
	}
	if (data['avatar']) {
		this.avatar = this._parseHref(data['avatar']);
	}
	if (data['branches']) {
		this.branches = this._parseHref(data['branches']);
	}
	if (data['clone']) {
		this.clone = data['clone'].map(function(item) {
			return {
				href: item['href'],
				name: item['name']
			};
		});
	}
	if (data['commits']) {
		this.commits = this._parseHref(data['commits']);
	}
	if (data['downloads']) {
		this.downloads = this._parseHref(data['downloads']);
	}
	if (data['forks']) {
		this.forks = this._parseHref(data['forks']);
	}
	if (data['hooks']) {
		this.hooks = this._parseHref(data['hooks']);
	}
	if (data['pullrequests']) {
		this.pullrequests = this._parseHref(data['pullrequests']);
	}
	if (data['self']) {
		this.self = this._parseHref(data['self']);
	}
	if (data['tags']) {
		this.tags = this._parseHref(data['tags']);
	}
	if (data['watchers']) {
		this.watchers = this._parseHref(data['watchers']);
	}
};


/**
 * @param {Object} link
 * @return {Object}
 * @private
 */
models.bitbucket.Links.prototype._parseHref = function(link) {
	return {
		href: link['href']
	};
};

