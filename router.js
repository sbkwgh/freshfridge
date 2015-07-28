var index = require('./routes/index.js');
var account = require('./routes/account.js');
var api = require('./routes/api.js');

module.exports = function(app) {
	app.use('/', index);
	app.use('/account', account);
	app.use('/api', api);
};