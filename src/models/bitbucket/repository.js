goog.provide('models.bitbucket.Repository');
goog.require('models.Abstract');
goog.require('models.bitbucket.Links');



/**
 * @param {*} data
 * @constructor
 */
models.bitbucket.Repository = function(data) {
	goog.base(this, data);
};
goog.inherits(models.bitbucket.Repository, models.Abstract);


/**
 * @override
 */
models.bitbucket.Repository.prototype.parse = function(data) {
	this.links = new models.bitbucket.Links(data['links']);
	this.type = data['type'];
	this.name = data['name'];
	this.fullName = data['full_name'];
	this.uuid = data['uuid'];
};
