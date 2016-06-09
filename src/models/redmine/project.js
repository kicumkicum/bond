goog.provide('models.redmine.Project');
goog.require('models.Abstract');



/**
 * @param {*} data
 * @constructor
 */
models.redmine.Project = function(data) {
	goog.base(this, data);
};
goog.inherits(models.redmine.Project, models.Abstract);


/**
 * @override
 */
models.redmine.Project.prototype.parse = function(data) {
	/** @type {Date} */
	this.createdOn = new Date(data['created_on']);
	/** @type {string} */
	this.description = data['description'];
	/** @type {number} */
	this.id = data['id'];
	/** @type {string} */
	this.identifier = data['identifier'];
	/** @type {string} */
	this.name = data['name'];
	/** @type {number} */
	this.status = data['status'];
	/** @type {Date} */
	this.updatedOn = new Date(data['updated_on']);
};
