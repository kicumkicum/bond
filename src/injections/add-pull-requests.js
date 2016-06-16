/**
 * @param {Array.<models.bitbucket.PullRequest>} pullrequests
 */
var addPullrequestList = function(pullrequests) {
	var pullrequestList = document.createElement('div');

	pullrequestList.innerHTML =
		'<div id="pullrequest-list">' +
		'<h3>Pullrequests (' + pullrequests.length + ')</h3>' +
		'</div>';

	var sideBarElement = document.getElementById('sidebar');
	sideBarElement.appendChild(pullrequestList);

	pullrequests.forEach(appendPullrequest);
};


/**
 * @param {models.bitbucket.PullRequest} pullrequest
 */
var appendPullrequest = function(pullrequest) {
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

	li.style.lineHeight = '1.0';
	li.style.listStyleType = 'none';
	li.appendChild(div);
	li.appendChild(a);
	document.getElementById('pullrequest-list').appendChild(li);
};


addPullrequestList(window['pullrequests']);
