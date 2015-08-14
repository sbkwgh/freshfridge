//Display delete button on left swipe
//Dismiss on right swipe or tap
$('.main-list').forEach(function(list) {
	var listHammer = new Hammer(list)

	listHammer.on('swipeleft', function(ev) {
		var tagName = ev.target.tagName.toLowerCase();
		if(tagName === 'div') {
			var liItem = ev.target.parentElement;
			$(liItem, '.main-list-delete', 1).classList.add('delete-right')
		} else if(tagName === 'li') {
			$(ev.target, '.main-list-delete', 1).classList.add('delete-right')
		}
	})
	listHammer.on('swiperight tap', function(ev) {
		var tagName = ev.target.tagName.toLowerCase();

		if(tagName === 'div') {
			var liItem = ev.target.parentElement;
			if(!ev.target.classList.contains('main-list-delete')) {
				$(liItem, '.main-list-delete', 1).classList.remove('delete-right')
			}
		} else if(tagName === 'li') {
			$(ev.target, '.main-list-delete', 1).classList.remove('delete-right')
		}
	})
});

var app = new Vue({
	el: 'body',
	data: {
		newListItem: {
			name: '',
			completed: false
		},
		items: store.get('items').filter(function(item) {
			return (new Date(item.expiry) - new Date() ) < 0;
		}).map(function(item) {
			if(typeof item.completed === 'undefined') {
				item.completed = false;
			}
			return item;
		}),
		listItems: store.get('listItems')
	},
	methods: {
		addListItem: function() {
			var newListItem = {
				name: this.newListItem.name.trim(),
				completed: false
			}

			if(newListItem.name) {
				this.listItems.push(newListItem);
				store.post('listItems', newListItem);

				this.newListItem.name = '';
			}
		},
		toggleCompleted: function(index, list) {
			var item = this[list][index];
			item.completed = !item.completed;

			this[list].$set(index, item);

			store.update(list, index, item);
		},
		delete: function(index, list) {
			this[list].$remove(index);
			store.delete(list, index);
		}
	}
});