var express = require('express');
var router = express.Router();
var config = require('../config.js');

var httpJSON = require('../functions/httpJSON.js');

router.get('/code', function(req, res, next) {
	httpJSON(
		'http://api.upcdatabase.org/json/' + config.UPCLookupKey + '/' + req.query.code,
		function(err, response) {
			var errors = [];
			var code, name;

			if(err) errors.push('unknown error');
			if(response.valid === 'false') errors.push('code not valid');
			if(errors.length) {
				res.json({
					errors: errors
				})
			} else {
				code = response.description;
				name = code.match(/ [0-9]+[a-zA-Z]+ .+/)[0].slice(1);

				res.json({name: name})
			}
		}
	)
});

module.exports = router;