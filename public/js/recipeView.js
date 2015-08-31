function scroll(el, sign) {
	sign = -sign;
	var width = -(el.offsetWidth * 0.9 * el.childElementCount) + el.offsetWidth + (el.offsetWidth * (el.childElementCount - 1) * 0.025) + 5;

	var currentLeft = +el.style.left.slice(0, -2);
	var newScrollLeft = currentLeft + Math.round(el.offsetWidth * sign * 0.82);

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

function getRecipes(self) {
	store.get('items', function(items) {
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

		function getArrayOfWordsInIngredientsList(ingredients) {
			var ingredientsList = [];

			ingredients.forEach(function(ingredient) {
				var splitIngredients = ingredient.split(' ').map(function(ingredient) {
					return ingredient.toLowerCase();
				});
				splitIngredients.forEach(function(splitIngredient) {
					ingredientsList.push(splitIngredient)
				})
			});

			return ingredientsList;
		}

		function checkIfRecipeContainsItemAsIngredient(recipe) {
				var recipeList = getArrayOfWordsInIngredientsList(recipe.ingredients);
				var answer = false;

			items.forEach(function(item) {
				name = item.name.toLowerCase();
				if(recipeList.indexOf(name) !== -1){
					answer = item.name;
					return;
				}
			})

			return answer;
		}

		function arrayOfCategoriesFromObj(obj) {
			var arr = [];

			Object.keys(obj).forEach(function(categoryTitle) {
				arr.push({
					title: categoryTitle,
					recipeCards: obj[categoryTitle]
				})
			})

			return arr;
		}

		var ingredients = shuffle(items).slice(0, 9).map(function(item) {
			return item.name;
		}).join(',');

		var categories = [];

		if(!ingredients.length) {
		
			self.$dispatch('toggleLoader');
			ajax.get('http://freshfridge.herokuapp.com/api/recipes', {ingredients: ingredients}, function(err, recipes) {
				if(!err) {
					recipes.recipes.forEach(function(recipe) {
						var recipeCategoryTitle = checkIfRecipeContainsItemAsIngredient(recipe);
						if(recipeCategoryTitle) {
							if(!categories[recipeCategoryTitle]) {
								categories[recipeCategoryTitle] = []
							}

							categories[recipeCategoryTitle].push(recipe)
						}
					})
					self.recipeCategories = arrayOfCategoriesFromObj(categories);

					localStorage.recipeCategories = JSON.stringify(arrayOfCategoriesFromObj(categories));
					self.$dispatch('toggleLoader');
				}
			});
		}
	});
}

var recipeView = {
	template: $('#recipeTemplate', 1).innerHTML,
	created: function() {
		this.$dispatch('menuItems', []);
		this.$on('closeSourceUrl', function() {
			this.showRecipeSource = false;
		})

		var self = this;

		if(localStorage.modified === 'false') {
			self.recipeCategories = store.get('recipeCategories');
		} else {
			localStorage.modified = 'false';
			getRecipes(self);
		}
		
	},
	data: function() {
		return {
			ingredients: '',
			starred: false,
			hideRecipe: true,
			recipeSourceUrl: '',
			showRecipeSource: false,
			starredRecipes: store.get('starredRecipes'),
			recipeCategories: []
		}
	},
	methods: {
		toggleRecipeCard: function(recipeIndex, categoryIndex, ev) {
			var el = ev.target;
			if(el.classList.contains('recipe-card-title')) {
				el = el.parentElement;
			}

			var recipe = this.recipeCategories[categoryIndex].recipeCards[recipeIndex];
			
			this.starred = false;
			
			for(var i = 0; i < this.starredRecipes.length; i++) {
				if(this.starredRecipes[i].image_url === recipe.image_url) {
					this.starred = true
				}
			}
			
			this.ingredients = recipe.ingredients;
			this.categoryIndex = categoryIndex;
			this.recipeIndex = recipeIndex;
			this.recipeSourceUrl = recipe.source_url;
			
			scroll(el.parentElement, -1 *  this.recipeCategories[categoryIndex].recipeCards.length);
			scroll(el.parentElement, recipeIndex);
			
			el.classList.toggle('recipe-card-full-width');
			el.parentElement.nextElementSibling.classList.toggle('recipe-hidden');
		},
		closeRecipeCard: function(ev) {
			var recipe = ev.target.parentElement.parentElement.parentElement;
			$('.recipe-card-full-width', 1).classList.toggle('recipe-card-full-width');
			recipe.classList.toggle('recipe-hidden');
		},
		recipeUrl: function() {
			this.$dispatch('toggleShowRecipeSource', this.recipeSourceUrl);
		},
		starRecipeCard: function() {
			var recipe = this.recipeCategories[this.categoryIndex].recipeCards[this.recipeIndex];
			var recipeStarred = false;
			var starRecipeCardIndex = null;
			
			for(var i = 0; i < this.starredRecipes.length; i++) {
				if(recipe.image_url === this.starredRecipes[i].image_url) {
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
			var el = ev.target;
			if(el.classList.contains('recipe-card-title')) {
				el = el.parentElement;
			}

			this.ingredients = this.starredRecipes[recipeIndex].ingredients;
			this.recipeIndex = recipeIndex;
			this.recipeSourceUrl = this.starredRecipes[recipeIndex].source_url;
			this.starred = true;
			
			scroll(el.parentElement, -1 *  this.starredRecipes.length);
			scroll(el.parentElement, recipeIndex);
			
			el.classList.toggle('recipe-card-full-width');
			el.parentElement.nextElementSibling.classList.toggle('recipe-hidden');
		},
		unstarStarredRecipeCard: function(ev) {
			var recipe = ev.target.parentElement.parentElement.parentElement;
			$('.recipe-card-full-width', 1).classList.toggle('recipe-card-full-width');
			recipe.classList.toggle('recipe-hidden');
			this.starredRecipes.$remove(this.recipeIndex)
			store.remove('starredRecipes', this.recipeIndex);
			scroll($('.recipe-cards')[0], -1);
		}
	}
};