/*//Show/hide searh bar
$('#menu-specific-search', 1).addEventListener('click', function(event) {
	document.body.classList.toggle('body-top-padding');
	$('#main-cover', 1).classList.toggle('no-visibility');
	$('#menu', 1).classList.toggle('no-visibility');
	$('#search-cover', 1).classList.toggle('no-visibility');
});
$('#search-cover', 1).addEventListener('click', function(event) {
	document.body.classList.toggle('body-top-padding');
	$('#search-cover', 1).classList.toggle('no-visibility');
});*/


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
			},
			{
				id: 'menu-specific-search',
				content: 'Search',
				event: 'menuSearch'
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
		deleteItem: function(index) {
			store.remove('items', index);
			this.items.$remove(index);
		}
	}
}