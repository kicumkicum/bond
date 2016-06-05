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

	var imageName = '';
	switch (pullrequest['state']) {
		case 'DECLINED':
			imageName = 'red';
			break;
		case 'MERGED':
			imageName = 'green';
			break;
		case 'OPEN':
			imageName = 'blue';
			break;

	}

	a.appendChild(div);
	div.innerHTML = '<div>' +
			'<div style="background-color:' + imageName +'; float:left; width:0.5em; height:0.5em; border-radius: 10em; margin-top:0.25em; margin-right: 0.5em"></div>' +
			'<a class="query" href="'+ pullrequest.links.html.href + '">' + pullrequest.title +'</a>' +
		'</div>';
	li.appendChild(div);
	document.getElementById('sidebar').lastChild.appendChild(li);
};

addPullrequests(window.pullrequests);
