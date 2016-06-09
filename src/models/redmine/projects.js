goog.provide('models.redmine.Projects');
goog.require('models.Abstract');
goog.require('models.redmine.Project');



/**
 * @param {*} data
 * @constructor
 * @extends {models.Abstract}
 */
models.redmine.Projects = function(data) {
	goog.base(this, data);
};
goog.inherits(models.redmine.Projects, models.Abstract);


/**
 * @override
 */
models.redmine.Projects.prototype.parse = function(data) {
	/** @type {Array.<models.redmine.Project>} */
	this.projects = (data['projects'] || []).map(function(project) {
		return new models.redmine.Project(project);
	});
	/** @type {number} */
	this.totalCount = data['total_count'];
	/** @type {number} */
	this.offset = data['offset'];
	/** @type {number} */
	this.limit = data['limit'];
};
