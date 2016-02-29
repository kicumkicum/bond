// Saves options to chrome.storage
function save_options() {
	var settings = {
		sync: document.getElementById('settings').value,
		redmineHost: document.getElementById('settings_redmine_host').value,
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
function restore_options() {
	// Use default value color = 'red' and likesColor = true.
	chrome.storage.sync.get(null, function(items) {
		document.getElementById('settings').value = items.settings.sync;
		document.getElementById('settings_token').value = items.settings.token;
		document.getElementById('settings_redmine_host').value = items.settings.redmineHost;
	});
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);