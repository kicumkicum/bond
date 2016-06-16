/**
 * @param {string} issue
 * @param {service.Syncer.BitbucketInfo} bitbucketInfo
 */
var addBranchList = function(issue, bitbucketInfo) {
	var branchList = document.createElement('div');
	var href = 'https://bitbucket.org/' + bitbucketInfo['owner'] + '/' + bitbucketInfo['repo'] + '/branch';

	branchList.innerHTML =
		'<div id="branch-list">' +
			'<div class="contextual">' +
				'<a href="' + href + '">Create branch</a>' +
			'</div>' +
			'<h3>Branches (0)</h3>' +
		'</div>';

	var sideBarElement = document.getElementById('sidebar');
	sideBarElement.appendChild(branchList);
};

addBranchList(window['issue'], window['bitbucketInfo']);
