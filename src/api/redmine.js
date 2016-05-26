goog.provide('api.Redmine');
goog.require('api.AbstractApi');
goog.require('config');
goog.require('models.redmine.Projects');
goog.require('utils.parser');



/**
 * @constructor
 * @extends {api.AbstractApi}
 */
api.Redmine = function() {
	this._url = 'http://' + config.redmine.host;
	this._realUrl = 'https://bitbucket.org';
	this._maxPageLength = 50;
};
goog.inherits(api.Redmine, api.AbstractApi);


/**
 * @return {IThenable<models.redmine.Projects>}
 */
api.Redmine.prototype.getProjects = function() {
	if (!config.redmine.apiKey) {
		return Promise.reject();
	}

	return this.request('http://' + config.redmine.host + '/projects.json?limit=100', {
		'X-Redmine-API-Key': config.redmine.apiKey
	})
		.then(function(response) {
			return new models.redmine.Projects(response);
		});
};
