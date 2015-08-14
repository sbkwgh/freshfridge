function $(selectorOrParentSelector, returnOneOrChildSelector, returnOne) {
	var elements;
	var retArr = [];

	//Get all elements matching selector
	//Or as children of parent selector
	if(typeof returnOneOrChildSelector === 'string') {
		if(typeof selectorOrParentSelector === 'object') {
			elements = selectorOrParentSelector.querySelectorAll(returnOneOrChildSelector);
		} else if(typeof selectorOrParentSelector === 'string') {
			elements = document.querySelector(selectorOrParentSelector).querySelectorAll(returnOneOrChildSelector);
		}
	} else {
		elements = document.querySelectorAll(selectorOrParentSelector);
	}

	//If there are any elements found
	if(elements.length) {
	  //Loop through to create a real array
		for(var i = 0; i < elements.length; i++) {
			retArr.push(elements[i]);
		}

		//Optionally return first element
		if(typeof returnOneOrChildSelector !== 'string') {
			if(returnOneOrChildSelector) {
				retArr = retArr[0]
			}	
		} else if(typeof returnOne !== 'undefined') {
			retArr = retArr[0]
		}

		return retArr;
	}

	return null;
}

var store = {
	get: function(name) {
		console.log('get ' + name);

		var items = JSON.parse(localStorage.getItem(name));

		return items || [];

	},
 	post: function(name, item) {
 		console.log('post ' + name);

 		var items = this.get(name);
 		items.push(item);

 		localStorage.setItem(name, JSON.stringify(items));
 	},
 	update: function(name, index, updatedItem) {
 		console.log('update ' + name);

 		var items =  this.get(name);
 		items[index] = updatedItem;

 		localStorage.setItem(name, JSON.stringify(items))
 	},
 	'delete': function(name, index) {
 		console.log('delete ' + name);

 		var items = this.get(name);
 		items.splice(index, 1);

 		localStorage.setItem(name, JSON.stringify(items));
 	}
 };


//Menu show/hide functionality
document.querySelector('#header-icon-more').addEventListener('click', function(event) {
	document.querySelector('#main-cover').classList.toggle('no-visibility');
	document.querySelector('#menu').classList.toggle('no-visibility');
});
document.querySelector('#main-cover').addEventListener('click', function(event) {
	document.querySelector('#menu').classList.toggle('no-visibility');
	this.classList.toggle('no-visibility');
});

//Icon link functionality
document.querySelector('#header-icon-fridge').addEventListener('click', function(event) {
	location.href = 'index.html'
});
document.querySelector('#header-icon-list').addEventListener('click', function(event) {
	location.href = 'list.html'
});
document.querySelector('#header-icon-recipe').addEventListener('click', function(event) {
	location.href = 'recipe.html'
});

//Add page show/hide functionality
document.querySelector('#header-icon-add').addEventListener('click', function() {
	document.querySelector('#main').classList.toggle('blur');
	if(document.querySelector('#add-container').style.top === '3rem') {
		document.querySelector('#add-container').style.top = '-100%';
	} else {
		document.querySelector('#add-container').style.top = '3rem';
	}
});	