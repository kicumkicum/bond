/**
 * @interface
 */
var IThenable = function() {};


/**
 * @param {function} resolve
 * @param {function=} reject
 * @return {IThenable}
 */
IThenable.prototype.then = function(resolve, opt_reject) {};

IThenable.resolve = function() {};
IThenable.reject = function() {};


/**
 * @constructor
 * @implements {IThenable}
 */
var Promise = function() {};
