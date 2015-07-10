/**
 * @interface
 */
var IThenable = function() {};

/**
 * @constructor
 * @implements {IThenable}
 */
var Promise = function() {};


/**
 * @param {*} args
 * @return {IThenable}
 */
Promise.prototype.then = function(args) {};