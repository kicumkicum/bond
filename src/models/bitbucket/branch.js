goog.provide('models.bitbucket.Branch');
goog.require('models.bitbucket.Links');


/**
 * @param {*} data
 * @constructor
 */
models.bitbucket.Branch = function(data) {
	this.links = new models.bitbucket.Links(data['links']);
	this.name = data['name'];
};
