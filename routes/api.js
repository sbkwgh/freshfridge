var express = require('express');
var router = express.Router();
var config = require('../config.js');
var request = require('request').defaults({ encoding: null });
var httpJSON = require('../functions/httpJSON.js');

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
			if(req.query.data) {
				request.get(url, function(err, imgRes, body) {
					if(!err && imgRes.statusCode === 200) {
						var dataUrl = 'data:' + imgRes.headers['content-type'] + ';base64,' + new Buffer(body).toString('base64');
						res.json({
							url: dataUrl
						});
					}
				})
			} else {
				res.json({
					url: url
				});
			}
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

function getRecipeList(ingredients, cb) {
	httpJSON(
		'http://food2fork.com/api/search?key=c5c5fa56a211d8753f8e60cabdbb7541&q=' + 
		encodeURIComponent(ingredients),
		function(err, recipes) {
			if(err) cb(err);


			function shuffle(arr) {
				arr = arr.slice(0)
				var shuffledArr = [];
				while (shuffledArr.length !== arr.length) {
					var rand = Math.floor(Math.random() * (1 + arr.length));
					if (typeof arr[rand] !== "undefined") {
						shuffledArr.push(arr[rand]);
						delete arr[rand];
					}
				}
				return shuffledArr;
			}

			var recipeIds = shuffle(recipes.recipes).slice(0, 9).map(function(recipe) {
				return recipe.recipe_id;
			})

			if(!recipes.recipes.length) {
				var newIngredients = shuffle(ingredients.split(',')).slice(0, ingredients.split(',').length-1).join(',');
				console.log(newIngredients)
				getRecipeList(newIngredients, cb)
			} else {
				cb(null, recipeIds);
			}
		}
	)
}

function getRecipes(recipeIds, cb) {
	var recipes = [];
	function done() {
		if(recipes.length === recipeIds.length) {
			cb(null, recipes);
		}
	}
	recipeIds.forEach(function(id) {
		var url = 'http://food2fork.com/api/get?key=c5c5fa56a211d8753f8e60cabdbb7541&rId=' + id;
		httpJSON(url, function(err, recipe) {
			if(err) cb(err);
			recipes.push(recipe.recipe);
			done()
		});
	})
}

router.get('/recipes', function(req, res) {
	if(!req.query.ingredients) {
		res.json({errors: ['ingredient parameter undefined']});
		return;
	}
	var ingredients = req.query.ingredients;
	getRecipeList(ingredients, function(err, recipeIds) {
		if(err) {
			res.json({errors: ['ingredient parameter undefined']});
			return;
		}
		getRecipes(recipeIds, function(err, recipes) {
			if(err) {
				res.json({errors: ['ingredient parameter undefined']});
				return;
			}
			res.json({recipes: recipes})
		});
	});
});

module.exports = router;