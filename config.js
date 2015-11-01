goog.provide('config');


config = {
	token: '',
	redmine: {
		host: ''
	}
};

chrome.storage.sync.get(null, function(items) {
	config.token = items.settings.token;
	config.redmine.host = items.settings.redmineHost;
});
