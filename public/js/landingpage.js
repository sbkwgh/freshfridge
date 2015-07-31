function getProducts() {
	console.log('Start get products')
	$.get('../api/item', function(data) {
		if(!data.items.length) {
			$('#no-products').show();
		} else {
			$('#no-products').hide();
		}
		var currentHTML = $('#products').html('');
		for(var i = 0; i < data.items.length; ++i) {
			var product = data.items[i];
			var expiresInXDays = '';

			if(product.daysUntilExpiry < 0 && product.daysUntilExpiry !== false) {
				expiresInXDays = ' | Already expired!'
			} else if(product.daysUntilExpiry >= 0 && product.daysUntilExpiry !== false) {
				expiresInXDays = " | Expires in " + product.daysUntilExpiry + " days";
			}


			var productDiv =
				"<div class='product'><span class='product-delete glyphicon glyphicon-remove-circle' aria-hidden='true' data-id=" + product._id + "></span>" +
				"<div class='product-image' data-name='" + product.name + "' style='background-image: url(" + (product.imageURL || '') + ")'>" +
				"</div>" +
				"<div class='product-name'>" + product.name + expiresInXDays + "</div></div>";
			var currentHTML = $('#products').html();
			currentHTML += productDiv;
			console.log(productDiv)
			$('#products').html(currentHTML)
		}
	});
}

getProducts();

$('#products').on('click', '.product .product-delete', function(e) {
	var id = $(e.currentTarget).attr('data-id');
	$.post('../api/item/remove', {
		_id: id
	}, function(data) {
		getProducts();
	})
})

$('#products').on('click', '.product .product-image', function(e) {
	var name = $(e.currentTarget).attr('data-name');
	window.location.href = 'recipe?ingredient=' + name;
})
$('#products').on('click', '.product .product-name', function(e) {
	var name = $(e.currentTarget).parent().find('.product-image').attr('data-name');
	window.location.href = 'recipe?ingredient=' + name;
})

$('#addProduct').on('click', function() {
	var year = $('#year').val();
	var month = $('#month').val();
	var date = $('#date').val();
	var name = $('#name').val();

	if(!name.trim()) return;

	$.post('../api/item/add', {
		productName: name,
		year: year,
		month: month,
		date: date
	}, function(data) {
		console.log(data)
		$('#year').val('');
		$('#month').val('');
		$('#date').val('');
		$('#name').val('');
		getProducts();
	})
})