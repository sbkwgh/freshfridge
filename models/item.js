var mongoose = require('mongoose');

var ItemSchema = mongoose.Schema({
	name: {
		type: String,
		required: true
	},
	username: {
		type: String,
		required: true
	},
	imageURL: String,
	dateCreated: {
		type: Date,
		default: Date.now
	},
	expiryDate: Date
});

var Item = mongoose.model('Item', ItemSchema);	

module.exports = Item;