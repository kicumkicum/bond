goog.provide('models.bitbucket.Links');
goog.require('models.Abstract');



/**
 * @param {Object} data
 * @constructor
 */
models.bitbucket.Links = function(data) {
	goog.base(this, data);
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
 * @return {Object}
 */
models.bitbucket.Links.prototype.toObject = function() {
	var obj = {};

	if (this.html) {
		obj['html'] = {
			'href': this.html.href
		};
	}
	if (this.avatar) {
		obj['avatar'] = {
			'href': this.avatar.href
		};
	}
	if (this.branches) {
		obj['branches'] = {
			'href': this.branches.href
		};
	}
	if (this.clone) {
		obj['clone'] = this.clone.map(function(item) {
			return {
				'href': item.href,
				'name': item.name
			};
		});
	}
	if (this.commits) {
		obj['commits'] = {
			'href': this.commits.href
		};
	}
	if (this.downloads) {
		obj['downloads'] = {
			'href': this.downloads.href
		};
	}
	if (this.forks) {
		obj['forks'] = {
			'href': this.forks.href
		};
	}
	if (this.hooks) {
		obj['hooks'] = {
			'href': this.hooks.href
		};
	}
	if (this.pullrequests) {
		obj['pullrequests'] = {
			'href': this.pullrequests.href
		};
	}
	if (this.self) {
		obj['self'] = {
			'href': this.self.href
		};
	}
	if (this.tags) {
		obj['tags'] = {
			'href': this.tags.href
		};
	}
	if (this.watchers) {
		obj['watchers'] = {
			'href': this.watchers.href
		};
	}

	return obj;
};


/**
 * @param {string} key
 * @return {?string}
 */
models.bitbucket.Links.prototype.getHref = function(key) {
	var item = this.toObject()[key];
	if (item) {
		return item['href'];
	} else {
		return null;
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
