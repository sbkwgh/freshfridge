var express = require('express');
var router = express.Router();
var config = require('../config.js');

var httpJSON = require('../functions/httpJSON.js');
var httpsJSON = require('../functions/httpsJSON.js');

var Item = require('../models/item.js');

function getProduct(code, cb) {
	httpJSON(
		'http://api.upcdatabase.org/json/' + config.UPCLookupKey + '/' + code,
		function(err, response) {
			var errors = [];

			if(err) errors.push('unknown error');
			if(!response || response.valid === 'false'  || response.itemname && response.description) errors.push('code not valid');
			if(errors.length) {
				cb(errors)
			} else {
				var description = response.description;
				var itemname = response.itemname;

				if(itemname) {
					cb(null, itemname)

				} else {
					//If the description is ABCKETCHUP3 500ml Heinz Ketchup
					//This gives '500ml Heinz Ketchup'
					var name = description.match(/ [0-9]+[a-zA-Z]+ .+/)[0].slice(1);
					//This gives '500ml ' --> 6
					numericComponent = name.match(/[0-9]+[a-zA-Z]+ /)[0].length;
					'Heinz Ketchup'
					name = name.slice(numericComponent);
					cb(null, name);
				}
			}
		}		
	)
}

function getImageURL(name, cb) {
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

//obj.username
//obj.name
//obj.imageurl
//obj.expiryDate
function addProduct(obj, cb) {
	var newItem = new Item(obj);
	newItem.save(function(err) {
		if(err) {
			cb(err);
		} else {
			cb(null, obj);
		}
	})
}

router.get('/code', function(req, res, next) {
	getProduct(req.query.code, function(err, product) {
		if(err) {
			res.json({
				errors: err
			})
		} else {
			res.json({
				name: product
			})
		}
	})
});

router.get('/image', function(req, res, next) {
	getImageURL(req.query.name, function(err, url) {
		if(err) {
			res.json({
				errors: err
			});
		} else {
			res.json({
				url: url
			});
		}
	})
})

router.post('/addProduct', function(req, res) {
	console.log('addProduct here')
	if(!req.signedCookies.loggedIn) {
		res.json({errors: 'unknown error'});
	}
	getProduct(req.body.code, function(err, product) {
		if(err) {
			res.json({errors: err});
		} else {
			getImageURL(product, function(err, url) {
				if(err) {
					res.json({errors: err})
				} else {
					var obj = {};
					//There might not be a URL for this product, you see
					if(url) {
						obj.imageurl = url;
					}
					obj.name = product;
					obj.username = req.signedCookies.username;
					if(req.body.year) {
						obj.expiryDate = new Date(req.body.year + '-' + req.body.month + '-' + req.body.date).toISOString();
					}

					addProduct(obj, function(err, product) {
						if(err) {
							res.json({
								errors: err
							})
						} else {
							res.json({
								success: true,
								product: product
							})
						}
					})
				}
			})
		}
	})
})

module.exports = router;