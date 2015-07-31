function getIngredients(cb) {
	$.get('../api/item', function(data) {
		var ingredients = [];
		if(!data.items.length) {
			$('#no-products').show();
		} else {
			$('#no-products').hide();
		}
		for(var i = 0; i < data.items.length; ++i) {
			ingredients.push(data.items[i].name);
		}
		cb(ingredients.join(','))
	});
}

function getRecipes(cb) {
	getIngredients(function(ingredients) {
		$.get('../api/recipes/ingredients?ingredients=' + ingredients, function(data) {
			var ret = [];

			for(var i = 0; i < data.recipes.length; i++) {
				if(!data.recipes[i].fault) {
					ret.push(data.recipes[i])
				}
			}

			var source = $("#recipes-template").html();
			var template = Handlebars.compile(source);
			var html = template({recipes: ret});
			$('#recipes').html(html);
		})
	})
}

getRecipes();