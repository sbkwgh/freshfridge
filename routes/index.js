var express = require('express');
var router = express.Router();
var User = require('../models/user.js');

//Index page and login screen
router.get('/', function(req, res) {
	if(req.signedCookies.loggedIn === 'true') {
		res.redirect('/home');
	} else {
		res.render('index')
	}
});

//Logged in homepage
router.get('/home', function(req, res) {
	if(req.signedCookies.loggedIn !== 'true') {
		res.redirect('/')
	} else {
		res.render('home');
	}
})

router.get('/soonExpiring', function(req, res) {
	if(req.signedCookies.loggedIn !== 'true') {
		res.redirect('/')
	} else {
		res.render('soonExpiring');
	}
})

router.get('/recipes', function(req, res) {
	if(req.signedCookies.loggedIn !== 'true') {
		res.redirect('/')
	} else {
		res.render('recipes');
	}
})

router.get('/shoppingList', function(req, res) {
	if(req.signedCookies.loggedIn !== 'true') {
		res.redirect('/')
	} else {
		res.render('shoppingList');
	}
})



module.exports = router;