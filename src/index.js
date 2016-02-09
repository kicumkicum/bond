goog.require('goog.base');
goog.require('service.Syncer');

/**
 * @param {Array.<models.bitbucket.Branch|models.bitbucket.PullRequest>} elements
 */
var showList = function(elements) {
	var makeLi = function(ul, name, clickListener) {
		var li = document.createElement('li');
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
	elements.forEach(function(element) {
		makeLi(ul, element.name || element.title, function() {
			window.open(element.links.html.href);
		});
	});
	ul.style.display = 'block';
};


var goto = function(url) {
	window.open(url);
};

var init = function() {
	var syncer = new service.Syncer;
	syncer.on('load', function() {
		document.getElementById('redmine').onclick = syncer.goToRedmineTicket.bind(syncer);
		document.getElementById('bit-pull').onclick = function() {
			utils.tab
				.getCurrentUrl()
				.then(function(url) {
					chrome.extension.sendMessage({
						'action': 'get-pullrequests',
						'source': url
					}, function(pr) {
						var pullrequests = pr.pr;
						if (pullrequests.length === 1) {
							goto(pullrequests[0].links.html.href);
						} else {
							showList(pullrequests);
						}
					});
				});


			var pullrequests = [];//syncer.getBitbucketPullRequestsSync();
			if (pullrequests.length === 1) {
				goto(pullrequests[0].links.html.href);
			} else {
				showList(pullrequests);
			}
		};
		document.getElementById('bit-branch').onclick = function() {
			syncer.getBitbucketBranches().then(showList);
		};
	});

	chrome.extension.onMessage.addListener(function(request, sender) {
		if (request.action == "get-branches") {
			console.log(request.source);
		}
	});
};

//window.addEventListener('load', init);
