var express = require('express');
var router = express.Router();
var config = require('../config.js');

var httpJSON = require('../functions/httpJSON.js');
var httpsJSON = require('../functions/httpsJSON.js');

router.get('/code', function(req, res, next) {
	httpJSON(
		'http://api.upcdatabase.org/json/' + config.UPCLookupKey + '/' + req.query.code,
		function(err, response) {
			var errors = [];
			var code, name;

			if(err) errors.push('unknown error');
			if(response.valid === 'false'  || response.itemname && response.description) errors.push('code not valid');
			if(errors.length) {
				res.json({
					errors: errors
				})
			} else {
				description = response.description;
				itemname = response.itemname;

				if(itemname) {
					res.json({name: itemname})

				} else {
					//If the description is ABCKETCHUP3 500ml Heinz Ketchup
					//This gives '500ml Heinz Ketchup'
					name = code.match(/ [0-9]+[a-zA-Z]+ .+/)[0].slice(1);
					//This gives '500ml ' --> 6
					numericComponent = name.match(/[0-9]+[a-zA-Z]+ /)[0].length;
					'Heinz Ketchup'
					name = name.slice(numericComponent);
					res.json({name: name})
				}
			}
		}		
	)
});

router.get('/image', function(req, res, next) {
	var options = {
		hostname: 'api.datamarket.azure.com',
		path:
			'/Bing/Search/v1/Image?Query=%27' +
			encodeURIComponent(req.query.name) +
			'%27&$top=1&$format=JSON',
		auth: 'username:' + config.bingKey
	};
	httpsJSON(options, function(err, response) {
		var errors = [];
		var code, imgURL;

		if(err) errors.push('unknown error');
		if(!response.d.results.length) errors.push('no images');

		if(errors.length) {
			res.json({
				errors: errors
			})
		} else {
			res.json({
				url: response.d.results[0].MediaUrl
			})
		}
	});
})

module.exports = router;