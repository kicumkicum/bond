goog.provide('models.bitbucket.Owner');
goog.require('models.Abstract');
goog.require('models.bitbucket.Links');



/**
 * @param {*} data
 * @constructor
 * @extends {models.Abstract}
 */
models.bitbucket.Owner = function(data) {
	goog.base(this, data);
};
goog.inherits(models.bitbucket.Owner, models.Abstract);


/**
 * @override
 */
models.bitbucket.Owner.prototype.parse = function(data) {
	this.display_name = data['display_name'];
	this.links = new models.bitbucket.Links(data['links']);
	this.type = data['type'];
	this.username = data['username'];
	this.uuid = data['uuid'];
};
