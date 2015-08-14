function scroll(el, sign) {
	var sign = -sign;
	var width = -el.offsetWidth * 0.925 * $('.recipe-card').length - $('.recipe-card', 1).offsetWidth * 0.025;

	var currentLeft = +el.style.left.slice(0, -2);
	var newScrollLeft = currentLeft + Math.round(el.offsetWidth * sign * 0.82);

	if(newScrollLeft <= width * 0.59538688785) {
		newScrollLeft = width + 'px';
	} else if(newScrollLeft > 0) {
		newScrollLeft = 0;
	}

	el.style.left = newScrollLeft + 'px';

}

$('.recipe-cards').forEach(function(recipeCards) {
	var recipeCardsHammer = new Hammer(recipeCards);

	$(recipeCards, '.recipe-card').forEach(function(recipeCard) {

		var recipeCardHammer = new Hammer(recipeCard);
		
		recipeCardHammer.on('tap', function() {
			var selectedRecipe;

			if($('#selected-recipe-cards')) {
				$('#selected-recipe-cards', 1).id = '';
			}

			recipeCards.id = 'selected-recipe-cards';
			selectedRecipe = $('#selected-recipe-cards + .recipe', 1);

			recipeCard.classList.toggle('recipe-card-full-width')
			selectedRecipe.classList.toggle('recipe-hidden');
		})
	});

	recipeCardsHammer.on('swipeleft', function() {
		scroll(recipeCards, +1);
	}) 
	recipeCardsHammer.on('swiperight', function() {
		scroll(recipeCards, -1);
	}) 
});

$('.recipe').forEach(function(recipe) {
	recipe.addEventListener('click', function(ev) {
		if(ev.target.classList.contains('cross')) {
			ev.target.parentElement.parentElement.parentElement.classList.toggle('recipe-hidden');
			$('.recipe-card-full-width', 1).classList.toggle('recipe-card-full-width')
		}
	})
})