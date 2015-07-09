goog.provide('models.bitbucket.Repository');
goog.require('models.bitbucket.Links');


/**
 * @param {*} data
 * @constructor
 */
models.bitbucket.Repository = function(data) {
	this.links = new models.bitbucket.Links(data['links']);
	this.type = data['type'];
	this.name = data['name'];
	this.fullName = data['full_name'];
	this.uuid = data['uuid'];
};
