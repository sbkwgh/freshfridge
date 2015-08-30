//Display text of expiry date
Vue.filter('daysUntilExpiry', function(expiryDate) {
	var daysUntilExpiry = Math.round((new Date(expiryDate) - new Date()) / (1000*60*60*24));

	if(daysUntilExpiry === 1) {
		return '1 day until expiry'
	} else if(daysUntilExpiry > 1) {
		return daysUntilExpiry + ' days until expiry'
	} else if(daysUntilExpiry === 0) {
		return 'Expires today';
	} else if(daysUntilExpiry < 0) {
		return 'Expired ' + Math.abs(daysUntilExpiry) + ' days ago'
	}

	return '';
});

var fridgeView = {
	template: $('#fridgeTemplate', 1).innerHTML,
	data: function() {	
		return {
			isEditing: false,
			tab: 'all',
			searchBox: '',
			items: []
		};
	},
	created: function() {
		var self = this;
		store.get('items', function(items) {
			self.items = items;
		});
		this.$dispatch('menuItems', [
			{
				id: 'menu-specific-edit',
				content: 'Edit items',
				event: 'menuEdit'
			}
		])
		this.$on('itemAdded', function(item) {
			this.items.push(item)
		})
		this.$on('toggleIsEditing', function(item) {
			this.isEditing = !this.isEditing;
		})
	},
	methods: {
		deleteItem: function(id, index) {
			store.remove('items', id);
			this.items.$remove(index);
		},
		selectTab: function(tabName) {
			var self = this;
			
			if(tabName === 'all') {
				this.tab = 'all';

				store.get('items', function(items) {
					self.items = items;
				});
			} else if(tabName === 'expiring') {
				this.tab = 'expiring';
				store.get('items', function(items) {
					self.items = items.filter(function(item) {
						var daysUntilExpiry = Math.round((new Date(item.expiryDate) - new Date()) / (1000*60*60*24));
						
						return daysUntilExpiry < 8;
					});
				});
			} else if(tabName === 'search') {
				this.searchBox = '';
				this.tab = 'search';

				store.get('items', function(items) {
					self.items = items;
				});

				$('#search input')[0].focus();
			}
		},
		search: function() {
			var self = this;
			store.get('items', function(items) {
				self.items = items.filter(function(item) {
					return item.name.slice(0, self.searchBox.length) === self.searchBox;
				});
			});
		}
	}
};