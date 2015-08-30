var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var config = require('./config.js');

var routes;

app.use(morgan('dev'))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
})); 
app.use(cookieParser(config.cookieSecret));

app.use(function nocache(req, res, next) {
  res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
  res.header('Expires', '-1');
  res.header('Pragma', 'no-cache');
  next();
})

routes = require('./router.js')(app);
app.use(express.static('./public'))

app.listen(process.env.PORT || 5000, function() {
	console.log('Server started and listening on port ' + process.env.PORT || 5000);
});