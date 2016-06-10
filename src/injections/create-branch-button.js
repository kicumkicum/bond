var addCreateBranchButton = function(issue, bitbucketInfo) {
	var sidebarElement = document.getElementById('sidebar');
	var title = document.createElement('a');

	title.innerText = 'Create branch';
	title.href = 'https://bitbucket.org/' + bitbucketInfo['owner'] + '/' + bitbucketInfo['repo'] + '/branch';

	sidebarElement.appendChild(title);
};

addCreateBranchButton(window['issue'], window['bitbucketInfo']);
