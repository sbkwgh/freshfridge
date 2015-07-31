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

getRecipes();