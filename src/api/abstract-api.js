goog.provide('api.AbstractApi');


/**
 * @constructor
 */
api.AbstractApi = function() {

};


/**
 * @param {string} url
 * @return {Promise}
 */
api.AbstractApi.prototype.request = function(url) {
	var xhr = new XMLHttpRequest();
	url = this._url + url;

	return new Promise(function(resolve, reject) {
		xhr.onreadystatechange = function() {
			if (xhr.readyState == 4) { // Request completed
				if (xhr.status == 200) {
					try {
						resolve(JSON.parse(xhr.responseText));
					} catch (e) {
						var err1 = new Error(e.message + '\n' + xhr.responseText.length + '\n' + url);
						reject(err1);
					}
				} else {
					var response;
					try {
						response = JSON.parse(xhr.responseText);
						if (response['error']) {
							reject(new Error(response['error'] + ': ' + xhr.status));
						} else {
							reject(new Error('Ошибка сети [1]: ' + xhr.status));
						}
					} catch (e) {
						reject(e);
					}
				}
			}
		};
		//xhr.open('GET', chrome.extension.getURL(url), true);
		xhr.open('GET', url, true);
		xhr.setRequestHeader("Authorization", "Basic a2ljdW1raWN1bToxMXpobG01");
		xhr.send();
	});
};
