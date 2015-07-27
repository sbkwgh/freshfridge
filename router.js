var index = require('./routes/index.js');

module.exports = function(app) {
	app.use('/', index);
};