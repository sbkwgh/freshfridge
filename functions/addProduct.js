var config = require('../config.js');

var Item = require('../models/item.js')

var httpJSON = require('../functions/httpJSON.js');
var httpsJSON = require('../functions/httpsJSON.js');

//obj.username
//obj.name
//obj.imageurl
//obj.expiryDate
module.exports = function addProduct(obj, cb) {
	var newItem = new Item(obj);
	newItem.save(function(err) {
		if(err) {
			cb(err);
		} else {
			cb(null, obj);
		}
	})
}