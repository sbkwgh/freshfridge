var express = require('express');
var router = express.Router();
var config = require('../config.js');

var nutritionix = require('nutritionix')({
	appId: '9b3a4047',
	appKey: '5122ce19b448f0286dbc4c5826602217'
}, false);

var getProduct = require('../functions/getProduct.js');
var getImageURL = require('../functions/getImageURL.js');

var yelpKeys = {
		consumer_key: "7p8XXcy2WsI9zyu3cy29kg", 
		consumer_secret: "iQbkHUv8Wk2nXZ_PfDeZZP4D1zQ",
		token: "aZ-3mK_l1WiaHzZIb9GBsPd0wR0qnO9P",
		token_secret: "c50CcTyg26vZTfG-G2LfCNjJ_pw"
};
var yelp = require("yelp").createClient(yelpKeys);

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

router.get('/supermarkets', function(req, res, next) {
	yelp.search({
		term: 'supermarket',
		location: req.query.address
	}, function(error, data) {
		var returnArray = [];
		if(!data.businesses.length) {
			res.json({ errors: ['no supermarkets found']})
			return;
		}
		for(var i = 0; i < data.businesses.length; ++i) {
			returnArray.push({
				lat: data.businesses[i].location.coordinate.latitude,
				lng: data.businesses[i].location.coordinate.longitude,
				name: data.businesses[i].name,
				address: encodeURIComponent(data.businesses[i].location.display_address.join(', '))
			});
		}
		res.json(returnArray);
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


router.get('/nutrition', function(req, res) {
	if(!req.query.item) {
		res.json({
			errors: ['no product term']
		})
		return;
	}

	nutritionix.natural('100g ' + req.query.item).then(function (results){
		res.json(results)
	});
})

module.exports = router;