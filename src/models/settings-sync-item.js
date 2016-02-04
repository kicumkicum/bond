goog.provide('models.SettingsSyncItem');
goog.require('models.Abstract');



/**
 * @inheritDoc
 * @constructor
 */
models.SettingsSyncItem = function(data) {
	goog.base(this, data);
};
goog.inherits(models.SettingsSyncItem, models.Abstract);


/**
 * @inheritDoc
 */
models.SettingsSyncItem.prototype.parse = function(data) {
	/** @type {string} */
	this.bitbucketRepoOwner = data['bitbucketRepoOwner'] || '';
	/** @type {string} */
	this.redmineProject = data['redmineProject'] || '';
	/** @type {string} */
	this.bitbucketRepo = data['bitbucketRepo'] || '';
};
