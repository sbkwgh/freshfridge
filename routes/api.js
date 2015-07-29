var express = require('express');
var router = express.Router();
var config = require('../config.js');

var getProduct = require('../functions/getProduct.js');
var getImageURL = require('../functions/getImageURL.js');
var addProduct = require('../functions/addProduct.js');

var Item = require('../models/item.js');

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

module.exports = router;