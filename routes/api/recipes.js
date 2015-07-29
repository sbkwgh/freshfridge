var express = require('express');
var router = express.Router();
var config = require('../../config.js');
var ObjectId = require('mongoose').Types.ObjectId;

var httpJSON = require('../../functions/httpJSON.js');

function getRecipeList(ingredients, cb) {
	httpJSON(
		'http://api.pearson.com:80/kitchen-manager/v1/recipes?ingredients-any=' + 
		encodeURIComponent(ingredients),
		function(err, recipes) {
			if(err) cb(err);
			cb(null, recipes);
		}
	)
}

function getRecipes(recipeList, cb) {
	var recipes = [];
	function done() {
		if(recipes.length === recipeList.total) {
			cb(null, recipes);
		}
	}
	recipeList.results.forEach(function(recipe) {
		var url = 'http' + recipe.url.slice('5');
		httpJSON(url, function(err, recipeContent) {
			if(err) cb(err);
			recipes.push(recipeContent);
			done()
		});
	})
}

router.get('/ingredients', function(req, res) {
	if(!req.query.ingredients) res.json({errors: ['ingredient parameter undefined']});
	var ingredients = req.query.ingredients;
	getRecipeList(ingredients, function(err, recipeList) {
		if(err) res.json({errors: ['unknown error']});
		getRecipes(recipeList, function(err, recipes) {
			if(err) res.json({errors: ['unknown error']});
			res.json({recipes: recipes})
		})
	});
})

module.exports = router;