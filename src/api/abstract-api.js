goog.provide('api.AbstractApi');


/**
 * @constructor
 */
api.AbstractApi = function() {

};


/**
 * @param {string} url
 * @param {Object.<string, string>=} opt_headers
 * @return {Promise}
 */
api.AbstractApi.prototype.request = function(url, opt_headers) {
	var xhr = new XMLHttpRequest();

	return new Promise(function(resolve, reject) {
		xhr.onreadystatechange = this._onReadyStateChange.bind(this, xhr, resolve, reject);
		xhr.open('GET', url, true);
		if (opt_headers) {
			this._setHeaders(xhr, opt_headers);
		}
		xhr.send();
	}.bind(this));
};


/**
 * @param {XMLHttpRequest} xhr
 * @param {Object.<string, string>} headers
 * @protected
 */
api.AbstractApi.prototype._setHeaders = function(xhr, headers) {
	for (var prop in headers) if (headers.hasOwnProperty(prop)) {
		xhr.setRequestHeader(prop, headers[prop]);
	}
};


api.AbstractApi.prototype._onReadyStateChange = function(xhr, resolve, reject) {
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


api.AbstractApi.prototype.getHTML = function(url) {
	return this.request(url);
};


api.AbstractApi.prototype.getAllElementsWithAttribute = function(attribute, opt_context) {
	var matchingElements = [];
	var allElements = (opt_context || document).getElementsByTagName('*');

	for (var i = 0, n = allElements.length; i < n; i++) {
		if (allElements[i].getAttribute(attribute) !== null) {
			matchingElements.push(allElements[i]);
		}
	}

	return matchingElements;
};
