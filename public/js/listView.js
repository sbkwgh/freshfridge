//Display delete button on left swipe
//Dismiss on right swipe or tap
var mainHammer = new Hammer($('#main', 1))

mainHammer.on('swipeleft tap', function(ev) {
	if(app.currentView !== 'list') return;
	var tagName = ev.target.tagName.toLowerCase();
	var parentTagName = ev.target.parentElement.tagName.toLowerCase();

	if(tagName === 'div' && parentTagName === 'li') {
		var liItem = ev.target.parentElement;
		$(liItem, '.main-list-delete', 1).classList.add('delete-right');
	} else if(tagName === 'li') {
		$(ev.target, '.main-list-delete', 1).classList.add('delete-right');
	}
});
mainHammer.on('swiperight tap', function(ev) {
		if(app.currentView !== 'list') return;
		var tagName = ev.target.tagName.toLowerCase();
		var parentTagName = ev.target.parentElement.tagName.toLowerCase();

		if(tagName === 'div' && parentTagName === 'li') {
			var liItem = ev.target.parentElement;
			if(!ev.target.classList.contains('main-list-delete')) {
				$(liItem, '.main-list-delete', 1).classList.remove('delete-right');
			}
		} else if(tagName === 'li') {
			$(ev.target, '.main-list-delete', 1).classList.remove('delete-right');
		}
});

var listView = {
	template: $('#listTemplate', 1).innerHTML,
	created: function() {
		var self = this;
		store.get('items', function(items) {
			var ret = items.filter(function(item) {
				return (new Date(item.expiryDate) - new Date() ) < 0;
			}).map(function(item) {
				if(item.completed === 'false') {
					item.completed = false;
				} else {
					item.completed = true
				}

				return item;
			});
			
			self.items = ret;
		});
		this.$dispatch('menuItems', []);
	},
	data: function() {
		return {
			newListItem: {
				name: '',
				completed: false
			},
			items: [],
			listItems: store.get('listItems')
		};
	},
	methods: {
		addListItem: function() {
			var newListItem = {
				name: this.newListItem.name.trim(),
				completed: false
			};

			if(newListItem.name) {
				this.listItems.push(newListItem);
				store.add('listItems', newListItem);

				this.newListItem.name = '';
			}
		},
		toggleCompleted: function(index, list, id) {
			var item = this[list][index];
			item.completed = !item.completed;

			this[list].$set(index, item);

			if(id) {
				index = id;
			}
			store.update(list, index, item);
		},
		remove: function(index, list) {
			this[list].$remove(index);
			store.remove(list, index);
		}
	}
};