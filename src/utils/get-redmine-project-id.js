function getRedmineProjectId() {
	var classList = document.body.classList;
	var projectClass = Array.prototype.filter.call(classList, function(className) {
		return className.indexOf('project') !== -1;
	})[0];
	var projectId = projectClass.substr('project-'.length);
	console.log(projectId);
	return projectId;
}


chrome.extension.sendMessage({
	action: "get-redmine-project-id",
	source: getRedmineProjectId()
});

