goog.provide('models.bitbucket.PullRequest');
goog.require('models.bitbucket.Links');
goog.require('models.bitbucket.Repository');


/**
 * @param {Object} data
 * @constructor
 */
models.bitbucket.PullRequest = function(data) {
	this.description = data['description'];
	this.links = new models.bitbucket.Links(data['links']);
	this.title = data['title'];
	this.destination = {
		repository: new models.bitbucket.Repository(data['destination']['repository'])
	};
	this.source = {
		repository: new models.bitbucket.Repository(data['source']['repository']),
		branch: {
			name: data['source']['branch']['name']
		}
	};
	this.state = data['state'];

	var url = this.links.html.href.split('/');
	this.id = url[url.length - 1];

	/** @type {models.bitbucket.PullRequest.State} */
	this.state = data['state'];
	/*this. = data[''];
	this. = data[''];
	this. = data[''];
	this. = data[''];
	this. = data[''];
	this. = data[''];
	this. = data[''];
	this. = data[''];
	var a = {
		"description": "* flow: Created branch 'feature/2497-fix-channel-on-air'.\r\n\r\n* mark channel on-air, when tv-player fire EVENT_CHANNEL_CHANGED\r\n\r\n* refactoring: rename variables",
		"links":  {
			"html":  {
				"href": "https://bitbucket.org/interfaced/persik.by/pull-request/118"
			}
		},
		"title": "Feature/2497 fix channel on air",
		"destination":  {
			"repository":  {
				"links":  {
					"html":  {
						"href": "https://bitbucket.org/interfaced/persik.by"
					}
				},
				"type": "repository",
				"name": "persik.by",
				"full_name": "interfaced/persik.by",
				"uuid": "{8f604794-fe26-46df-a1fa-daaaf5aaab75}"
			}
		},
		"source":  {
			"repository":  {
				"links":  {
					"self":  {
						"href": "https://api.bitbucket.org/2.0/repositories/interfaced/persik.by"
					},
					"html":  {
						"href": "https://bitbucket.org/interfaced/persik.by"
					},
					"avatar":  {
						"href": "https://bitbucket.org/interfaced/persik.by/avatar/16/"
					}
				},
				"type": "repository",
				"name": "persik.by",
				"full_name": "interfaced/persik.by",
				"uuid": "{8f604794-fe26-46df-a1fa-daaaf5aaab75}"
			},
			"branch":  {
				"name": "feature/2497-fix-channel-on-air"
			}
		},
		"state": "MERGED"
	}*/
};


/**
 * @enum {string}
 */
models.bitbucket.PullRequest.State = {
	DECLINED: 'DECLINED',
	MERGED: 'MERGED',
	OPEN: 'OPEN'
};
