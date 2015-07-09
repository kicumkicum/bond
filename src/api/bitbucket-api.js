goog.provide('api.Bitbucket');
goog.require('api.AbstractApi');
goog.require('models.bitbucket.PullRequest');


/**
 * @constructor
 * @extends {api.AbstractApi}
 */
api.Bitbucket = function() {
	this._url = 'https://bitbucket.org/api/2.0/';
	this._owner = 'interfaced';
	this._repoSlug = 'persik.by'

};
goog.inherits(api.Bitbucket, api.AbstractApi);


/**
 * @return {IThenable}
 */
api.Bitbucket.prototype.getPullRequests = function() {
	var url = 'repositories/' + this._owner + '/' + this._repoSlug + '/pullrequests/?state=merged,open';
	return this.request(url)
		.then(function(response) {
			var pulls = response['values'];
			return pulls.map(function(pull) {
				return new models.bitbucket.PullRequest(pull);
			});
		});
};
