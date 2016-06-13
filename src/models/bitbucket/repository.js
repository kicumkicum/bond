goog.provide('models.bitbucket.Repository');
goog.require('models.Abstract');
goog.require('models.bitbucket.Links');
goog.require('models.bitbucket.Owner');



/**
 * @param {*} data
 * @constructor
 * @extends {models.Abstract}
 */
models.bitbucket.Repository = function(data) {
	goog.base(this, data);
};
goog.inherits(models.bitbucket.Repository, models.Abstract);


/**
 * @override
 */
models.bitbucket.Repository.prototype.parse = function(data) {
	this.createdOn = new Date(data['created_on']);
	this.description = data['description'];
	this.forkPolicy = data['fork_policy'];
	this.fullName = data['full_name'];
	this.hasIssues = data['has_issues'];
	this.hasWiki = data['has_wiki'];
	this.isPrivate = data['is_private'];
	this.language = data['language'];
	this.links = new models.bitbucket.Links(data['links']);
	this.name = data['name'];
	this.owner = new models.bitbucket.Owner(data['owner']);
	this.project = data[''];
	this.scm = data['scm'];
	this.size = data['size'];
	this.type = data['type'];
	this.updatedOn = new Date(data['updated_on']);
	this.uuid = data['uuid'];
	this.website = data['website'];
};
