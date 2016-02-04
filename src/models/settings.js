goog.provide('models.Settings');
goog.require('models.Abstract');
goog.require('models.SettingsSyncItem');



/**
 * @inheritDoc
 * @extends {models.Abstract}
 * @constructor
 */
models.Settings = function(data) {
	goog.base(this, data);
};
goog.inherits(models.Settings, models.Abstract);


/**
 * @inheritDoc
 */
models.Settings.prototype.parse = function(data) {
	/** @type {string} */
	this.bitbucketToken = data['bitbucketToken'] || '';

	/** @type {string} */
	this.redmineHost = data['redmineHost'] || '';

	/** @type {Array.<models.SettingsSyncItem>} */
	this.sync = (data['sync'] || []).map(function(item) {
		return new models.SettingsSyncItem(item);
	});
};


