/**
 * @param {string} issue
 * @param {service.Syncer.BitbucketInfo} bitbucketInfo
 * @param {Array<models.bitbucket.Branch>} branches
 */
var addBranchList = function(issue, bitbucketInfo, branches) {
	var branchList = document.createElement('div');
	var href = 'https://bitbucket.org/' + bitbucketInfo['owner'] + '/' + bitbucketInfo['repo'] + '/branch';

	branchList.innerHTML =
		'<div id="branch-list">' +
			'<div class="contextual">' +
				'<a href="' + href + '">Create branch</a>' +
			'</div>' +
			'<h3>Branches (' + branches.length + ')</h3>' +
		'</div>';

	var sideBarElement = document.getElementById('sidebar');
	sideBarElement.appendChild(branchList);

	branches.forEach(appendBranch);
};


/**
 * @param {models.bitbucket.Branch} branch
 */
var appendBranch = function(branch) {
	var a = document.createElement('a');
	var li = document.createElement('li');
	var div = document.createElement('div');

	div.style.cssText = 'float: left; width: 0.5em; height: 0.5em; border-radius: 1em; margin-top: 0.25em; margin-right: 0.5em';
	div.style.backgroundColor = 'blue';

	var linkText = document.createTextNode(branch.name);
	a.appendChild(linkText);
	a.setAttribute('class', 'query');
	a.href = branch.links.html.href;

	li.style.lineHeight = '1.0';
	li.style.listStyleType = 'none';
	li.appendChild(div);
	li.appendChild(a);

	document.getElementById('branch-list').appendChild(li);
};

addBranchList(window['issue'], window['bitbucketInfo'], window['branches']);
