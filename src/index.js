/**
 * Created by oleg on 08.07.15.
 */
(setTimeout(function() {
	var syncer = new Syncer;
	var goto = function(url) {
		location.href = url;
		open(url);
	};

	chrome.tabs.getSelected(function(tab) {
		var url = tab.url;
		syncer.setUrl(url);
	});

	document.getElementById('redmine').addEventListener('click', function() {
		var url = syncer.getRedMineTicketUrl();
		goto(url);
	});
	document.getElementById('bit-branch').addEventListener('click', function() {
		var url = syncer.getBitbucketBranchUrl();
		goto(url);
	});
	document.getElementById('bit-pull').addEventListener('click', function() {
		var url = syncer.getBitbucketPullRequestUrl();
		goto(url);
	});
}, 2000))();
