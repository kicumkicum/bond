goog.provide('models.bitbucket.Project');
goog.require('models.Abstract');
goog.require('models.bitbucket.Links');



/**
 * @param {*} data
 * @constructor
 * @extends {models.Abstract}
 */
models.bitbucket.Project = function(data) {
	goog.base(this, data);
};
goog.inherits(models.bitbucket.Project, models.Abstract);


/**
 * @override
 */
models.bitbucket.Project.prototype.parse = function(data) {
	this.key = data['key'];
	this.links = new models.bitbucket.Links(data['links']);
	this.name = data['name'];
	this.type = data['type'];
	this.uuid = data['uuid'];
};
