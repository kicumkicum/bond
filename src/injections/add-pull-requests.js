/**
 * @param {Array.<models.bitbucket.PullRequest>} pullrequests
 */
var addPullrequests = function(pullrequests) {
	pullrequests.forEach(addPullrequest);
};


/**
 * @param {models.bitbucket.PullRequest} pullrequest
 */
var addPullrequest = function(pullrequest) {
	console.log('uo');
	var li = document.createElement('li');
	var a = document.createElement('a');

	a.setAttribute('class', 'query');
	a.setAttribute('href', pullrequest.links.html.href);
	a.innerText = pullrequest.title;

	li.appendChild(a);
	document.getElementById('sidebar').lastChild.appendChild(li);
};

addPullrequests(window.pullrequests);
