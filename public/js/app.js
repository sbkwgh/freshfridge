Vue.config.debug = true;

//Add page show/hide functionality
document.querySelector('#header-icon-add').addEventListener('click', function() {
	document.querySelector('#main').classList.toggle('blur');
	if(document.querySelector('#add-container').style.top === '3rem') {
		document.querySelector('#add-container').style.top = '-100%';
	} else {
		document.querySelector('#add-container').style.top = '3rem';
	}
});

var app = new Vue({
	el: 'body',
	data: {
		display: {
			isEditing: false,
			menuVisible: false
		},
		currentView: 'fridge',
		menuItems: [],
		newItem: {
			name: '',
			year: '',
			month: '',
			day: ''
		}
	},
	created: function() {
		if(localStorage.modified === undefined) {
			localStorage.modified = true;
		}
		this.$on('menuItems', function(menuItems) {
			this.menuItems = menuItems;
		});
		this.$on('toggleEditing', function() {
			this.display.isEditing = !this.display.isEditing;
		})
	},
	components: {
		fridge: fridgeView,
		list: listView,
		recipe: recipeView
	},
	methods: {
		addItem: function() {
			var name = this.newItem.name.trim();
			var year = this.newItem.year;
			var month = this.newItem.month;
			var day = this.newItem.day;

			var self = this;

			if(!name) return;

			ajax.get(
				'/api/image',
				{name: name},
				function(err, image) {
					if(!err) {
						var newItem = {
							imageURL: image.url,
							name: name,
							expiryDate: new Date(year + '-' + month + '-' + day)
						};
						store.add('items', newItem);
						self.$broadcast('itemAdded', newItem);
						localStorage.modified = 'true';
					}
				}
			);

			this.newItem.name = '';
			this.newItem.day = 'Day';
			this.newItem.month = 'Month';
			this.newItem.year = 'Year';

			$('#header-icon-add', 1).click();
		},
		cancelAddItem: function() {
			this.newItem.name = '';
			this.newItem.day = 'Day';
			this.newItem.month = 'Month';
			this.newItem.year = 'Year';

			$('#header-icon-add', 1).click();
		},
		menuEdit: function() {
			this.display.isEditing = !this.display.isEditing;
			this.display.menuVisible = !this.display.menuVisible;

			this.$broadcast('toggleIsEditing');
		},
		doneEditing: function() {
			this.display.isEditing = !this.display.isEditing;

			if(this.currentView === 'recipe') {
				this.$broadcast('closeSourceUrl');
			} else {
				this.$broadcast('toggleIsEditing');
			}
		},
		menuEvent: function(event) {
			this[event]();
		},
		toggleMenu: function() {
			this.display.menuVisible = !this.display.menuVisible;
		},
		changeView: function(viewName) {
			location.hash = viewName;
		}
	}
});

window.onload = function() {
	var view = (location.hash.slice(1) ? location.hash.slice(1) : 'fridge');

	app.currentView = view;
};
window.onhashchange = function() {
	var view = (location.hash.slice(1) ? location.hash.slice(1) : 'fridge');

	app.currentView = view;
};