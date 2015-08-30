function getNutrition() {
	$.get('../api/nutrition?item=' + window.location.search.slice(12), function(data) {
		var nutrition = data.results[0];

		nutrition.nutrients.map(function(nutrient) {
			nutrient.value = +nutrient.value.toFixed(3)
			return nutrient;
		})


		var source = $("#nutrition-template").html();
		var template = Handlebars.compile(source);
		var html = template({
			nutrients: nutrition.nutrients.splice(0, 10)
		});
		$('#nutrition').html(html);
	})
}

function getRecipes(cb) {
	$.get('../api/recipes/ingredients?ingredients=' + window.location.search.slice(12), function(data) {
		var ret = [];

		for(var i = 0; i < data.recipes.length; i++) {
			if(!data.recipes[i].fault) {
				ret.push(data.recipes[i])
			}
		}

		if(!ret.length) {
			$('#no-products').show()
		}

		var source = $("#recipes-template").html();
		var template = Handlebars.compile(source);
		var html = template({recipes: ret});
		$('#recipes').html(html);
	})
}

$('#no-products').hide()

getNutrition();
getRecipes();