/**
 * @param {Array.<models.bitbucket.PullRequest>} pullrequests
 */
var addPullrequests = function(pullrequests) {
	if (!document.getElementById('sidebar').lastChild.innerText) {
		pullrequests.forEach(addPullrequest);
	}
};


/**
 * @param {models.bitbucket.PullRequest} pullrequest
 */
var addPullrequest = function(pullrequest) {
	var a = document.createElement('a');
	var li = document.createElement('li');
	var div = document.createElement('div');

	var statusColor = '';
	switch (pullrequest['state']) {
		case 'DECLINED':
			statusColor = 'red';
			break;
		case 'MERGED':
			statusColor = 'green';
			break;
		case 'OPEN':
			statusColor = 'blue';
			break;

	}

	div.style.cssText = 'float: left; width: 0.5em; height: 0.5em; border-radius: 1em; margin-top: 0.25em; margin-right: 0.5em';
	div.style.backgroundColor = statusColor;

	var linkText = document.createTextNode(pullrequest.title);
	a.appendChild(linkText);
	a.setAttribute('class', 'query');
	a.href = pullrequest.links.html.href;

	li.appendChild(div);
	li.appendChild(a);
	document.getElementById('sidebar').lastChild.appendChild(li);
};

addPullrequests(window.pullrequests);
