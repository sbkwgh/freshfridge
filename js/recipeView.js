function scroll(el, sign) {
	var sign = -sign;
	var width = -el.offsetWidth * 0.925 * $('.recipe-card').length - $('.recipe-card', 1).offsetWidth * 0.025;

	var currentLeft = +el.style.left.slice(0, -2);
	var newScrollLeft = currentLeft + Math.round(el.offsetWidth * sign * 0.82);

	console.log(newScrollLeft + ' ' + width * 0.59538688785)

	if(newScrollLeft <= width * 0.4) {
		newScrollLeft = width + 'px';
	} else if(newScrollLeft > 0) {
		newScrollLeft = 0;
	}

	el.style.left = newScrollLeft + 'px';

}


var mainHammer = new Hammer($('#main', 1));
mainHammer.on('swipeleft', function(ev) {
	if(ev.target.classList.contains('recipe-card')) {
		scroll(ev.target.parentElement, +1);
	}
}) 
mainHammer.on('swiperight', function(ev) {
	if(ev.target.classList.contains('recipe-card')) {
		scroll(ev.target.parentElement, -1);
	}
})

var recipeView = {
	template: $('#recipeTemplate', 1).innerHTML,
	created: function() {
		this.$dispatch('menuItems', [])
	},
	data: function() {
		return {
			ingredients: '',
			hideRecipe: true,
			recipeCategories: [
				{
					title: 'Breakfast',
					recipeCards: [
						{
							image: 'http://static.food2fork.com/Bacon2BWrapped2BJalapeno2BPopper2BStuffed2BChicken2B5002B5909939b0e65.jpg',
							title: 'Chicken with bacon',
							ingredients: [
								'Cheese',
								'Bacon rashers',
								'4 chicken breasts',
							]
						},
						{
							image: 'http://static.food2fork.com/Bacon2BWrapped2BJalapeno2BPopper2BStuffed2BChicken2B5002B5909939b0e65.jpg',
							title: 'Chicken with bacon',
							ingredients: [
								'Cheese',
								'Bacon rashers',
								'4 chicken breasts',
							]
						},
						{
							image: 'http://static.food2fork.com/Bacon2BWrapped2BJalapeno2BPopper2BStuffed2BChicken2B5002B5909939b0e65.jpg',
							title: 'Chicken with bacon',
							ingredients: [
								'Cheese',
								'Bacon rashers',
								'4 chicken breasts',
							]
						}
					]
				},
				{
					title: 'Breakfast',
					recipeCards: [
						{
							image: 'http://static.food2fork.com/Bacon2BWrapped2BJalapeno2BPopper2BStuffed2BChicken2B5002B5909939b0e65.jpg',
							title: 'Chicken with bacon',
							ingredients: [
								'Cheese',
								'Bacon rashers',
								'4 chicken breasts',
							]
						},
						{
							image: 'http://static.food2fork.com/Bacon2BWrapped2BJalapeno2BPopper2BStuffed2BChicken2B5002B5909939b0e65.jpg',
							title: 'Chicken with bacon',
							ingredients: [
								'Cheese',
								'Bacon rashers',
								'4 chicken breasts',
							]
						},
						{
							image: 'http://static.food2fork.com/Bacon2BWrapped2BJalapeno2BPopper2BStuffed2BChicken2B5002B5909939b0e65.jpg',
							title: 'Chicken with bacon',
							ingredients: [
								'Cheese',
								'Bacon rashers',
								'4 chicken breasts',
							]
						}
					]
				}
			]
		};
	},
	methods: {
		toggleRecipeCard: function(recipeIndex, ev) {
			var categoryIndex = +ev.target.parentElement.previousElementSibling.id;
			this.ingredients = this.recipeCategories[categoryIndex].recipeCards[recipeIndex].ingredients;

			ev.target.classList.toggle('recipe-card-full-width');
			ev.target.parentElement.nextElementSibling.classList.toggle('recipe-hidden');
		},
		closeRecipeCard: function(ev) {
			var recipe = ev.target.parentElement.parentElement.parentElement;
			$('.recipe-card-full-width', 1).classList.toggle('recipe-card-full-width');
			recipe.classList.toggle('recipe-hidden');
		},
		recipeUrl: function() {

		}
	}
};