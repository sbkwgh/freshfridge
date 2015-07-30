var address;

function getCoords(cb) {
		//If the device supports geolocation
		if(navigator.geolocation) {
			//Get locations
			navigator.geolocation.getCurrentPosition(function(obj) {
				console.log(obj.coords.latitude + ',' + obj.coords.longitude)

				mapCenter = { lat: obj.coords.latitude, lng: obj.coords.longitude}
				cb(obj.coords.latitude, obj.coords.longitude);
			});
		}
}

function getAddress(cb) {
	getCoords(function(lat, lng) {
		var geocoder = new google.maps.Geocoder();
		var latLng = new google.maps.LatLng(lat, lng)
		geocoder.geocode({location: latLng}, function(results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				 if (results[1]) {
					console.log(results[1].formatted_address)
					address = results[1].formatted_address;
					cb(results[1].formatted_address);
				 }
			}
		})
	})
}

function getSupermarkets(cb) {
	getAddress(function(address) {
		$.get('/api/supermarkets?address=' + address, function(results) {
			console.log(results)
			cb(results);
		})
	})
}

function initialize() {
	getSupermarkets(function(supermarkets) {
		var doneNum = 0;
		var markers = [];

		for(var i = 0; i < supermarkets.length; ++i) {
			var marker = new google.maps.Marker({
				position: new google.maps.LatLng(supermarkets[i].lat, supermarkets[i].lng),
				title: 
					supermarkets[i].name +
					'<br/><a href="https://www.google.co.uk/maps/dir/' +
					address +
					'/' +
					supermarkets[i].address +
					'" target="_blank">Get directions</a>'
			});
			markers.push(marker);
		}

		console.log(markers)
		
		console.log(mapCenter)

		var mapOptions = {
			center: {
				lat: supermarkets[0].lat,
				lng: supermarkets[0].lng
			},
			zoom: 13
		};

		var map = new google.maps.Map(document.getElementById('map'), mapOptions);
		var infoWindow = new google.maps.InfoWindow();

		for(var i = 0; i < markers.length; ++i) {
			markers[i].setMap(map);
			google.maps.event.addListener(markers[i], 'click', function() {
				infoWindow.setContent(this.get('title'));
				infoWindow.open(map,this);
			});
		}

	});
}

google.maps.event.addDomListener(window, 'load', initialize);

$.get('../api/item/soonExpiring', function(data) {
	var products = data.items;
	var expiredProducts = [];
	for(var i = 0; i < products.length; ++i) {
		if(products[i].daysUntilExpiry < 0 && products[i].daysUntilExpiry !== false) {
			expiredProducts.push(products[i])
		}
	}

	if(!expiredProducts.length) {
		$('#no-products').show();
	} else {
		$('#no-products').hide();
	}

	var currentHTML = $('#products').html('');

	for(var i = 0; i < expiredProducts.length; ++i) {
		var expiredProduct = expiredProducts[i];

		var productDiv =
			"<div class='product'><div class='product-delete' data-id=" + expiredProduct._id + ">&times;</div>" +
			"<div class='product-image' style='background-image: url(" + (expiredProduct.imageURL || '') + ")'>" +
			"</div>" +
			"<div class='product-name'>" + expiredProduct.name + "</div></div>";
		var currentHTML = $('#products').html();
		currentHTML += productDiv;
		$('#products').html(currentHTML);
	}
});