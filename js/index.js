//Show/hide edit bar
$('#menu-specific-edit', 1).addEventListener('click', function() {
	app.isEditing = !app.isEditing;
	$('#header-icons', 1).classList.toggle('hidden');
	$('#header-action', 1).classList.toggle('hidden');
	$('#menu', 1).classList.toggle('no-visibility');
	$('#main-cover', 1).classList.toggle('no-visibility');
})
$('#header-action button', 1).addEventListener('click', function() {
	app.isEditing = !app.isEditing;
	$('#header-icons', 1).classList.toggle('hidden');
	$('#header-action', 1).classList.toggle('hidden');
})

//Show/hide searh bar
$('#menu-specific-search', 1).addEventListener('click', function(event) {
	document.body.classList.toggle('body-top-padding');
	$('#main-cover', 1).classList.toggle('no-visibility');
	$('#menu', 1).classList.toggle('no-visibility');
	$('#search-cover', 1).classList.toggle('no-visibility');
});
$('#search-cover', 1).addEventListener('click', function(event) {
	document.body.classList.toggle('body-top-padding');
	$('#search-cover', 1).classList.toggle('no-visibility');
});

//Display text of expiry date
Vue.filter('daysUntilExpiry', function(expiryDate) {
	var daysUntilExpiry = Math.round((new Date(expiryDate) - new Date()) / (1000*60*60*24));

	if(daysUntilExpiry === 1) {
		return '1 day until expiry'
	} else if(daysUntilExpiry === 0 || daysUntilExpiry > 1) {
		return daysUntilExpiry + ' days until expiry'
	} else if(daysUntilExpiry < 0) {
		return 'Expired ' + Math.abs(daysUntilExpiry) + ' days ago'
	}

	return '';
})

var app = new Vue({
	el: 'body',
	data: {
		newItem: {
			name: '',
			expiryDate: ''
		},
		isEditing: false,
		items: store.get('items')
	},
	methods: {
		deleteItem: function(index) {
			store.delete('items', index);
			app.items.$remove(index);
		},
		addItem: function() {
			var newItem = {
				url: 'http://www.melissahartfiel.com/wp-content/uploads/2013/04/20130426-1304_untitled0051.jpg',
				name: app.newItem.name,
				expiry: new Date(app.newItem.expiryDate)
			}

			store.post('items', newItem);
			app.items.push(newItem);

			$('#header-icon-add', 1).click();
		}
	}
})