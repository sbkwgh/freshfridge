var api = require('./routes/api.js');
var recipes = require('./routes/api/recipes.js');

module.exports = function(app) {
	app.use('/api', api);
	app.use('/api/recipes', recipes);
};