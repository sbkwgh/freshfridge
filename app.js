var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var config = require('./config.js');

var routes;
var db;

//Problem here
mongoose.connect('mongodb://localhost/fridgething')
db = mongoose.connection;

app.set('views', './templates');
app.set('view engine', 'twig');

app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
})); 
app.use(cookieParser(config.cookieSecret));

routes = require('./router.js')(app);
app.use(express.static('./public'))

db.once('open', function(){
	console.log('Connected to db');
	app.listen(3000, function() {
		console.log('Listening on port 3000');
	});
})