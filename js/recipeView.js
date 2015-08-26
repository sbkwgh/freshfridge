function scroll(el, sign) {
	sign = -sign;
	var width = -(el.offsetWidth * 0.9 * el.childElementCount) + el.offsetWidth + (el.offsetWidth * (el.childElementCount - 1) * 0.025) + 5;

	var currentLeft = +el.style.left.slice(0, -2);
	var newScrollLeft = currentLeft + Math.round(el.offsetWidth * sign * 0.82);

	console.log(newScrollLeft + ' ' + width)
	if(newScrollLeft <= width) {
		console.log('here')
		newScrollLeft = width;
	} else if(newScrollLeft > 0) {
		newScrollLeft = 0;
	}
	
	if(el.childElementCount === 1) {
		return;
	}

	el.style.left = newScrollLeft + 'px';

}


var mainHammer = new Hammer($('#main', 1));
mainHammer.on('swipeleft', function(ev) {
	if(ev.target.classList.contains('recipe-card')) {
		scroll(ev.target.parentElement, +1);
	}
});
mainHammer.on('swiperight', function(ev) {
	if(ev.target.classList.contains('recipe-card')) {
		scroll(ev.target.parentElement, -1);
	}
});

var recipeView = {
	template: $('#recipeTemplate', 1).innerHTML,
	created: function() {
		this.$dispatch('menuItems', []);
		
	},
	data: function() {
		return {
			ingredients: '',
			starred: false,
			hideRecipe: true,
			starredRecipes: store.get('starredRecipes'),
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
		toggleRecipeCard: function(recipeIndex, categoryIndex, ev) {
			var recipe = this.recipeCategories[categoryIndex].recipeCards[recipeIndex];
			
			this.starred = false;
			
			for(var i = 0; i < this.starredRecipes.length; i++) {
				if(this.starredRecipes[i].image === recipe.image) {
					this.starred = true
				}
			}
			
			this.ingredients = recipe.ingredients;
			this.categoryIndex = categoryIndex;
			this.recipeIndex = recipeIndex;
			
			scroll(ev.target.parentElement, -1 *  this.recipeCategories[categoryIndex].recipeCards.length);
			scroll(ev.target.parentElement, recipeIndex);
			
			ev.target.classList.toggle('recipe-card-full-width');
			ev.target.parentElement.nextElementSibling.classList.toggle('recipe-hidden');
		},
		closeRecipeCard: function(ev) {
			var recipe = ev.target.parentElement.parentElement.parentElement;
			$('.recipe-card-full-width', 1).classList.toggle('recipe-card-full-width');
			recipe.classList.toggle('recipe-hidden');
		},
		recipeUrl: function() {

		},
		starRecipeCard: function() {
			var recipe = this.recipeCategories[this.categoryIndex].recipeCards[this.recipeIndex];
			var recipeStarred = false;
			var starRecipeCardIndex = null;
			
			for(var i = 0; i < this.starredRecipes.length; i++) {
				if(recipe.image === this.starredRecipes[i].image) {
					recipeStarred = true;
					starRecipeCardIndex = i;
				}
			}
			
			if(!recipeStarred) {
				this.starredRecipes.push(recipe);
				store.add('starredRecipes', recipe);
			} else {
				this.starredRecipes.$remove(starRecipeCardIndex);
				store.remove('starredRecipes', this.recipeIndex);
			}
			this.starred = !this.starred;
		},
		toggleStarredRecipeCard: function(recipeIndex, ev) {
			this.ingredients = this.starredRecipes[recipeIndex].ingredients;
			this.recipeIndex = recipeIndex;
			this.starred = true;
			
			scroll(ev.target.parentElement, -1 *  this.starredRecipes.length);
			scroll(ev.target.parentElement, recipeIndex);
			
			ev.target.classList.toggle('recipe-card-full-width');
			ev.target.parentElement.nextElementSibling.classList.toggle('recipe-hidden');
		},
		unstarStarredRecipeCard: function(ev) {
			var recipe = ev.target.parentElement.parentElement.parentElement;
			$('.recipe-card-full-width', 1).classList.toggle('recipe-card-full-width');
			recipe.classList.toggle('recipe-hidden');
			this.starredRecipes.$remove(this.recipeIndex)
			store.remove('starredRecipes', this.recipeIndex);
		}
	}
};