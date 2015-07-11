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
	this._repoSlug = 'persik.by';
	this._maxPageLength = 50;

};
goog.inherits(api.Bitbucket, api.AbstractApi);


/**
 * @return {IThenable.<models.bitbucket.PullRequest>}
 */
api.Bitbucket.prototype.getPullRequests = function() {
	var url = this._url + 'repositories/' + this._owner + '/' + this._repoSlug + '/pullrequests/?state=merged,open' +
		'&pagelen=' + this._maxPageLength;
	var pulls = [];
	var httpHeader = {'Authorization': 'Basic a2ljdW1raWN1bToxMXpobG01'};

	var request = function(url) {
		return this
			.request(url, httpHeader)
			.then(function(response) {
				var responsePulls = response['values'].map(function(pull) {
					return new models.bitbucket.PullRequest(pull);
				});

				pulls = pulls.concat(responsePulls);
				return response['next'];
			})
			.then(function(url) {
				if (url) {
					return request(url, httpHeader);
				} else {
					return pulls;
				}
			});
	}.bind(this);

	return request(url);
};
