if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body);
    }, false);
}

//Menu
document.querySelector('#header-icons').addEventListener('click', function(event) {
	event.target.parentElement.classList.toggle('header-icon-active')
	if(document.querySelector('.header-icon-active')) {
		document.querySelector('.header-icon-active').classList.toggle('header-icon-active');
	}
})

document.querySelector('#header-icon-more').addEventListener('click', function(event) {
	document.querySelector('#main-cover').classList.toggle('no-visibility');
	document.querySelector('#menu').classList.toggle('no-visibility');
});
document.querySelector('#main-cover').addEventListener('click', function(event) {
	document.querySelector('#menu').classList.toggle('no-visibility');
	this.classList.toggle('no-visibility');
});

document.querySelector('#header-icon-fridge').addEventListener('click', function(event) {
	location.href = 'index.html'
});
document.querySelector('#header-icon-list').addEventListener('click', function(event) {
	location.href = 'list.html'
});
document.querySelector('#header-icon-recipe').addEventListener('click', function(event) {
	location.href = 'recipe.html'
});

document.querySelector('#header-icon-add').addEventListener('click', function() {
	document.querySelector('#main').classList.toggle('blur');
	if(document.querySelector('#add-container').style.top === '3rem') {
		document.querySelector('#add-container').style.top = '-100%';
	} else {
		document.querySelector('#add-container').style.top = '3rem';
	}
});	


if(document.querySelector('#menu-specific-search')) {
	document.querySelector('#menu-specific-search').addEventListener('click', function(event) {
		document.body.classList.toggle('body-top-padding');
		document.querySelector('#main-cover').classList.toggle('no-visibility');
		document.querySelector('#menu').classList.toggle('no-visibility');
		document.querySelector('#search-cover').classList.toggle('no-visibility');
	});
	document.querySelector('#search-cover').addEventListener('click', function(event) {
		document.body.classList.toggle('body-top-padding');
		document.querySelector('#search-cover').classList.toggle('no-visibility');
	});
}

[].forEach.call(document.querySelectorAll('input[type=checkbox]'), function(checkbox) {
	checkbox.addEventListener('change', function() {
		if(this.checked) {
			this.parentElement.parentElement.querySelector('.strikethrough').classList.add('strikethrough-width')
		} else {
			this.parentElement.parentElement.querySelector('.strikethrough').classList.remove('strikethrough-width')
		}
	})
	if(checkbox.checked) {
		checkbox.parentElement.parentElement.querySelector('.strikethrough').classList.add('strikethrough-width')
	}
})

var list = document.querySelectorAll('.main-list li');
[].forEach.call(list, function(listItem) {
	var listHammer = new Hammer(listItem)
	listHammer.on('swipeleft', function(ev) {
		var liItem = ev.target.parentElement;
		listItem.querySelector('.main-list-delete').classList.add('delete-right')
	})
	listHammer.on('swiperight tap', function(ev) {
		var liItem = ev.target.parentElement;
		if(ev.target.classList.contains('main-list-delete')) {
			listItem.parentElement.removeChild(listItem)
		} else {
			listItem.querySelector('.main-list-delete').classList.remove('delete-right')
		}
	})
})