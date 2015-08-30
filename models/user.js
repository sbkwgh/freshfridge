var mongoose = require('mongoose');
//var bcrypt = require('bcrypt');

var lengthValidation = [
	function (val) {
		return (val.length >= 1 && val.length <= 255);
	},
	"{PATH} must be below 255 characters"
]

var UserSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		index: {
			unique: true
		},
		validate: lengthValidation
	},
	password: {
		type: String,
		required: true,
		validate: lengthValidation
	},
	phone: {
		type: String,
		validate: lengthValidation
	}
})

/*UserSchema.pre('save', function(next, done) {
	bcrypt.hash(this.password, 10, function(err, hash) {
		this.password = hash;
		done();
	})
})*/

UserSchema.statics.checkAccount = function(usernameToCheck, passwordToCheck, cb) {
	this.findOne({username: usernameToCheck}, function(err, userFound) {
		if(userFound) {
			cb(passwordToCheck === userFound.password);
		} else {
			cb(false);
		}
	})
}

var User = mongoose.model('User', UserSchema);	

module.exports = User;