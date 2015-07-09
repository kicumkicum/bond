goog.provide('models.bitbucket.Links');


models.bitbucket.Links = function(data) {
	this.html = (function(html) {
		return {
			href: html['href']
		};
	})(data['html']);
};
