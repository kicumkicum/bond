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

	div.innerHTML =
		'<div>' +
			'<div style="background-color:' + statusColor +'; float:left; width:0.5em; height:0.5em; border-radius: 10em; margin-top:0.25em; margin-right: 0.5em"></div>' +
			'<a class="query" href="'+ pullrequest.links.html.href + '">' + pullrequest.title +'</a>' +
		'</div>';

	a.appendChild(div);
	li.appendChild(div);
	document.getElementById('sidebar').lastChild.appendChild(li);
};

addPullrequests(window.pullrequests);
