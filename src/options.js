// Saves options to chrome.storage
function saveOptions() {
	var settings = {
		sync: document.getElementById('settings').value,
		redmineHost: document.getElementById('settings_redmine_host').value,
		redmineApiKey: document.getElementById('settings_redmine_api_key').value,
		token: document.getElementById('settings_token').value
	};
	//settings = JSON.parse(settings);

	chrome.storage.sync.set({
		'settings': settings
	}, function() {
		// Update status to let user know options were saved.
		var status = document.getElementById('status');
		status.textContent = 'Options saved.';
		setTimeout(function() {
			status.textContent = '';
		}, 750);
	});
}

// Restores select box and checkbox state using the preferences
// stored in chrome.storage.
function restoreOptions() {
	// Use default value color = 'red' and likesColor = true.
	chrome.storage.sync.get(null, function(items) {
		document.getElementById('settings').value = items.settings.sync;
		document.getElementById('settings_token').value = items.settings.token;
		document.getElementById('settings_redmine_host').value = items.settings.redmineHost;
		document.getElementById('settings_redmine_api_key').value = items.settings.redmineApiKey;
	});
}
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
