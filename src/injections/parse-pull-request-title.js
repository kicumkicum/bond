var parse = function(redmineUrl) {
	var pullrequestTitle = document.getElementsByClassName('pull-request-title')[0].lastElementChild;
	var str = pullrequestTitle.innerHTML;
	str = str.trim().split(' ');
	var ticket = str[0];
	str[0] = [
		'<a href="',
		redmineUrl,
		ticket.replace('#', '')
			.replace('Feature/', '')
			.replace('Hotfix/', ''),
		'">', str[0],
		'</a>'
	].join('');
	str = str.join(' ');

	if (pullrequestTitle.innerHTML.indexOf('<a') === -1) {
		pullrequestTitle.innerHTML = str;
	}
};

parse(window.redmineUrl);
