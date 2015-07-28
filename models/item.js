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

ItemSchema.virtual('daysUntilExpiry').get(function() {
	if(!this.expiryDate) return false;

	var diff = this.expiryDate.getTime() - (new Date()).getTime();
	return Math.round(diff/1000/60/60/24);
})

var Item = mongoose.model('Item', ItemSchema);	

module.exports = Item;