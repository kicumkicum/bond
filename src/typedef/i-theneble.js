/**
 * @interface
 */
var IThenable = function() {};


/**
 * @param {*} args
 * @return {IThenable}
 */
IThenable.prototype.then = function(args) {};

/**
 * @constructor
 * @implements {IThenable}
 */
var Promise = function() {};
