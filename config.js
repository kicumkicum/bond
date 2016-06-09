goog.provide('config');


config = {
	bitbucket: {
		owner: ''
	},
	token: '',
	redmine: {
		host: ''
	}
};

chrome.storage.sync.get(null, function(items) {
	config.bitbucket.owner = items.settings.bitbucketOwner;
	config.token = items.settings.token;
	config.redmine.host = items.settings.redmineHost;
	config.redmine.apiKey = items.settings.redmineApiKey;
});
