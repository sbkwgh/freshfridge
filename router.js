var api = require('./routes/api.js');

module.exports = function(app) {
	app.use('/api', api);
};