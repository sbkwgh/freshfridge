var express = require('express');
var router = express.Router();
var config = require('../../config.js');
var ObjectId = require('mongoose').Types.ObjectId;

var getProduct = require('../../functions/getProduct.js');
var getImageURL = require('../../functions/getImageURL.js');
var addProduct = require('../../functions/addProduct.js');

var Item = require('../../models/item.js');

router.post('/add', function(req, res) {
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
});

router.get('/', function(req, res) {
	if(!req.signedCookies.loggedIn) res.json({errors: ['unknown error']});

	Item.find({username: req.signedCookies.username}, function(err, items) {
		if(err) res.json({errors: ['unknown error']});
		res.json({
			items: items
		});
	});
})

router.post('/remove', function(req, res) {
	if(!req.signedCookies.loggedIn) res.json({errors: ['unknown error']});

	Item.findOne({_id: ObjectId(req.body._id)}).remove(function(err, item) {
		if(err) res.json({errors: ['unknown error']});
		res.json({
			success: true
		})
	});
})

router.get('/soonExpiring', function(req, res) {
	if(!req.signedCookies.loggedIn) res.json({errors: ['unknown error']});
	
	var today = (new Date).getTime();

	Item.find({username: req.signedCookies.username}, function(err, items) {
		if(err) res.json({errors: ['unknown error']});

		var returnItems = [];

		for(var i = 0; i < items.length; ++i) {
			if(items[i].daysUntilExpiry !== false && items[i].daysUntilExpiry <= 3) {
				returnItems.push(items[i].toJSON({virtuals:true}));
			}
		}
		res.json({
			items: returnItems
		});
	})
})

module.exports = router;