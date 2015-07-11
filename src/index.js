/**
 * Created by oleg on 08.07.15.
 */
goog.require('goog.base');
goog.require('Syncer');

var init = function() {
	var syncer = new Syncer;
	var goto = function(url) {
		window.open(url);
	};

	chrome.tabs.getSelected(function(tab) {
		var url = tab.url;
		syncer.setUrl(url);
	});

	document.getElementById('redmine').addEventListener('click', function() {
		syncer.getRedMineTicketUrl()
			.then(goto);
	});
	document.getElementById('bit-branch').addEventListener('click', function() {
		syncer.getBitbucketBranchUrl();
			//.then(function(all) {
				//console.log(all);
			//});
	});
	document.getElementById('bit-pull').addEventListener('click', function() {
		syncer.getBitbucketPullRequestUrl()
			.then(goto);
	});
};

window.addEventListener('load', init);
