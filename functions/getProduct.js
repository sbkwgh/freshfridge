var config = require('../config.js');

var httpJSON = require('../functions/httpJSON.js');
var httpsJSON = require('../functions/httpsJSON.js');

module.exports = function(code, cb) {
	httpJSON(
		'http://api.upcdatabase.org/json/' + config.UPCLookupKey + '/' + code,
		function(err, response) {
			var errors = [];

			if(err) errors.push('unknown error');
			if(!response || response.valid === 'false'  || response.itemname && response.description) errors.push('code not valid');
			if(errors.length) {
				cb(errors)
			} else {
				var description = response.description;
				var itemname = response.itemname;

				if(itemname) {
					cb(null, itemname)

				} else {
					//If the description is ABCKETCHUP3 500ml Heinz Ketchup
					//This gives '500ml Heinz Ketchup'
					var name = description.match(/ [0-9]+[a-zA-Z]+ .+/);
					if(name) {
						name = name[0].slice(1);
						//This gives '500ml ' --> 6
						numericComponent = name.match(/[0-9]+[a-zA-Z]+ /)[0].length;
						//'Heinz Ketchup'
						name = name.slice(numericComponent);
						cb(null, name);
					} else {
						cb(null, description)
					}
				}
			}
		}		
	)
}