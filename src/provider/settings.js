goog.provide('provider.Settings');
goog.require('models.Settings');



/**
 * @constructor
 */
provider.Settings = function() {
	this._settings = new models.Settings;

	document.addEventListener('DOMContentLoaded', function() {
		chrome.storage.sync.get(null, function(items) {
			this._settings = new models.Settings(items);
		}.bind(this));
	}.bind(this));
};


/**
 * @return {string}
 */
provider.Settings.prototype.getToken = function() {
	return this._settings.bitbucketToken;
};


/**
 * @return {?string}
 */
provider.Settings.prototype.getRedmineHost = function() {
	return this._settings.redmineHost;
};


/**
 * @param {string} repoOrProject
 * @return {models.SettingsSyncItem}
 */
provider.Settings.prototype.getPairFor = function(repoOrProject) {
	return this._settings.sync.filter(function(pair) {
		return Object.keys(pair).filter(function(key) {
			return pair[key] === repoOrProject;
		})[0];
	})[0];
};


/**
 * @type {models.Settings}
 */
provider.Settings.prototype._settings;


/**
 * Fired with: none
 * @const {string}
 */
provider.Settings.prototype.EVENT_LOAD = 'load';
