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
		syncer.getBitbucketBranches()
			.then(function(branches) {
				var makeLi = function(ul, name, clickListener) {
					var li = document.createElement("li");
					li.onclick = clickListener;
					li.appendChild(document.createTextNode(name));
					ul.appendChild(li);
				};

				var ul = document.getElementById('content');
				makeLi(ul, 'back', function() {
					while (ul.lastChild) {
						ul.removeChild(ul.lastChild);
					}
					ul.setAttribute('display', 'none');
				});
				branches.forEach(function(branch) {
					makeLi(ul, branch.name, function() {
						window.open(branch.links.html.href);
					});
				});
				ul.style.display = 'block';
			});
	});
	document.getElementById('bit-pull').addEventListener('click', function() {
		syncer.getBitbucketPullRequestUrl()
			.then(goto);
	});

	chrome.extension.onMessage.addListener(function(request, sender) {
		if (request.action == "get-branches") {
			console.log(request.source);
		}
	});
};

window.addEventListener('load', init);
