goog.provide('models.Abstract');



/**
 * @param {*|undefined} data
 * @constructor
 */
models.Abstract = function(data) {
	if (data) {
		this.parse(data);
	}
};


/**
 * @type {*} data
 */
models.Abstract.prototype.parse = function() {};
