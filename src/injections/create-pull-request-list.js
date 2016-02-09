var createPullRequestsList = function() {
	var sidebarElement = document.getElementById('sidebar');
	var children = sidebarElement.children;
	if (children[children.length - 1].innerText.indexOf('Pull-Requests') !== -1 ||
		children[children.length - 2].innerText.indexOf('Pull-Requests') !== -1) {
		return;
	}

	var title = document.createElement('h3');
	var ul = document.createElement('ul');

	title.innerText = 'Pull-Requests';

	ul.setAttribute('class', 'queries');

	sidebarElement.appendChild(title);
	sidebarElement.appendChild(ul);
};


createPullRequestsList();
