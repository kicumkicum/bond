var createPullRequestsList = function() {
	var sidebarElement = document.getElementById('sidebar');
	var title = document.createElement('h3');
	var ul = document.createElement('ul');

	title.innerText = 'Pull-Requests';
	ul.setAttribute('class', 'queries');

	sidebarElement.appendChild(title);
	sidebarElement.appendChild(ul);
};


createPullRequestsList();
