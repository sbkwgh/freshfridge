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