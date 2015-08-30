var config = require('../config.js');

var httpJSON = require('../functions/httpJSON.js');
var httpsJSON = require('../functions/httpsJSON.js');

module.exports = function(name, cb) {
	var options = {
		hostname: 'api.datamarket.azure.com',
		path:
			'/Bing/Search/v1/Image?Query=%27' +
			encodeURIComponent(name) +
			'%27&$top=1&$format=JSON',
		auth: 'username:' + config.bingKey
	};
	httpsJSON(options, function(err, response) {
		var errors = [];
		var code, imgURL;

		if(err) errors.push('unknown error');
		if(!response.d.results.length) errors.push('no images');

		if(errors.length) {
			cb(errors)
		} else {
			cb(null, response.d.results[0].MediaUrl);
		}
	});
}
