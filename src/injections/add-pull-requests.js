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
	var image = document.createElement('img');

	var imageName = '';
	switch (pullrequest.state) {
		case 'DECLINED':
			imageName = 'false';
			break;
		case 'MERGED':
			imageName = 'true';
			break;
		case 'OPEN':
			imageName = 'ticket';
			break;

	}

	image.setAttribute('src', '../images/' + imageName + '.png');
	image.setAttribute('height', '10px');
	image.style.marginRight = '5px';

	a.setAttribute('class', 'query');
	a.setAttribute('href', pullrequest.links.html.href);
	a.innerText = pullrequest.title;

	div.appendChild(image);
	div.appendChild(a);

	li.appendChild(div);
	document.getElementById('sidebar').lastChild.appendChild(li);
};

addPullrequests(window.pullrequests);
