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
		this.$on('menuItems', function(menuItems) {
			this.menuItems = menuItems;
		});
	},
	components: {
		fridge: fridgeView,
		list: listView,
		recipe: recipeView
	},
	methods: {
		addItem: function() {
			if(!this.newItem.name.trim()) return;
			var newItem = {
				imageURL: 'http://www.melissahartfiel.com/wp-content/uploads/2013/04/20130426-1304_untitled0051.jpg',
				name: this.newItem.name.trim(),
				expiryDate: new Date(this.newItem.year + '-' + this.newItem.month + '-' + this.newItem.day)
			};

			store.add('items', newItem);
			this.$broadcast('itemAdded', newItem);

			this.newItem.name = '';
			this.newItem.day = '';
			this.newItem.month = '';
			this.newItem.year = '';

			$('#header-icon-add', 1).click();
		},
		cancelAddItem: function() {
			this.newItem.name = '';
			this.newItem.day = '';
			this.newItem.month = '';
			this.newItem.year = '';

			$('#header-icon-add', 1).click();
		},
		menuEdit: function() {
			this.display.isEditing = !this.display.isEditing;
			this.display.menuVisible = !this.display.menuVisible;

			this.$broadcast('toggleIsEditing');
		},
		doneEditing: function() {
			this.display.isEditing = !this.display.isEditing;
			this.$broadcast('toggleIsEditing');
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