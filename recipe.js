function scroll(el, sign) {
	var sign = -sign;
	var width = -el.offsetWidth * 0.925 * el.querySelectorAll('.recipe-card').length - el.querySelector('.recipe-card').offsetWidth * 0.025;

	var currentLeft = +el.style.left.slice(0, -2);
	var newScrollLeft = currentLeft + Math.round(el.offsetWidth * sign * 0.82);

	if(newScrollLeft <= width * 0.59538688785) {
		newScrollLeft = width + 'px';
	} else if(newScrollLeft > 0) {
		newScrollLeft = 0;
	}

	el.style.left = newScrollLeft + 'px';

}

[].forEach.call(document.querySelectorAll('.recipe-cards'), function(recipeCards) {
	var recipeCardsHammer = new Hammer(recipeCards);

	recipeCardsHammer.on('swipeleft', function() {
		scroll(recipeCards, +1);
	}) 
	recipeCardsHammer.on('swiperight', function() {
		scroll(recipeCards, -1);
	}) 
});