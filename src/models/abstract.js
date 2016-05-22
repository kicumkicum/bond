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
 * @param {*} data
 */
models.Abstract.prototype.parse = goog.abstractMethod;
