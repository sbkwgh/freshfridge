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

var webSQL = {
	db: function() {
		if(!this.db.db) {
			this.openDb();
			this.createTable();
		}
		return this.db.db;
	},
	onError: function(tx, err) {
		console.log(err);
	},
	onSuccess: function() {
		console.log('success');
	},
	openDb: function() {
		var dbSize = 4 * 1024 * 1024;
		
		if(!openDatabase) {
			store.onError();
			return;
		}
	
		this.db.db = openDatabase('store', 1, 'database for the app', dbSize);
	},
	createTable: function() {
		var db = this.db();
		
		db.transaction(function(tx) {
			tx.executeSql('CREATE TABLE IF NOT EXISTS items(ID INTEGER PRIMARY KEY ASC, name TEXT, imageURL TEXT, expiryDate DATETIME)', []);
		});
	},
	add: function(obj) {
		var db = this.db();
		
		db.transaction(function(tx) {
			tx.executeSql(
				'INSERT INTO items(name, imageURL, expiryDate) VALUES(?, ?, ?)',
				[obj.name, obj.imageURL, obj.expiryDate],
				this.onSuccess, 
				this.onError
			);
		});
	},
	get: function(cb) {
		var db = this.db();
		
		function success(tx, results) {
			var items = [];
			
			for(var i = 0; i < results.rows.length; i++) {
				items.push(results.rows.item(i));
			}
			
			cb(items);
		}
		
		db.transaction(function(tx) {
			tx.executeSql(
				'SELECT * FROM items',
				[],
				success,
				this.onError
			);
		});
	},
	remove: function(index) {
		var db = this.db();
		
		db.transaction(function(tx) {
			tx.executeSql(
				'DELETE FROM items WHERE ID=?',
				[index],
				this.onSuccess,
				this.onError
			);
		});
	},
	update: function(index, item) {
		var db = this.db();
		
		db.transaction(function(tx) {
			tx.executeSql(
				'UPDATE items SET name=?, imageURL=?, expiryDate=? WHERE ID=?',
				[item.name, item.imageURL, item.expiryDate, index],
				this.onSuccess,
				this.onError
			);
		});
	}
};
var store = {
	get: function(name, cb) {
		console.log('get ' + name);

		if(name === 'items') {
			this.webSQL.get(cb);
		} else {
			var items = JSON.parse(localStorage.getItem(name));
			return items || [];
		}

	},
	add: function(name, item) {
		console.log('post ' + name);

		if(name === 'items') {
			this.webSQL.add(item);
		} else {
			var items = this.get(name);
			items.push(item);

			localStorage.setItem(name, JSON.stringify(items));
		}
	},
	update: function(name, index, updatedItem) {
		console.log('update ' + name);

		if(name === 'items') {
			this.webSQL.update(index, updatedItem);
		} else {
			var items =  this.get(name);
			items[index] = updatedItem;

			localStorage.setItem(name, JSON.stringify(items));
		}
	},
	remove: function(name, index) {
		console.log('delete ' + name);

		if(name === 'items') {
			this.webSQL.remove(index);
		} else {
			var items = this.get(name);
			items.splice(index, 1);

			localStorage.setItem(name, JSON.stringify(items));
		}
	},
	webSQL: webSQL
};