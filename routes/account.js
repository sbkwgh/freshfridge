var express = require('express');
var router = express.Router();
var User = require('../models/user.js');

var config = require('../config.js');

//Route to which the form sends
router.post('/login', function(req, res) {
	User.checkAccount(
		req.body.username,
		req.body.password,
		function(correct) {
			if(correct) {
				res.cookie('loggedIn', 'true', {signed: true});
				res.cookie('username', req.body.username, {signed: true});
				res.redirect('/home')
			} else {
				res.render('login', {
					errors: [
						'Wrong username or password'
					]
				});
			}
		}
	)
})

router.get('/login', function(req, res) {
	res.render('login');
})

router.get('/create', function(req, res) {
	res.render('createAccount');
})

router.get('/logout', function(req, res) {
	res.cookie('loggedIn', false, {signed: true});
	res.clearCookie('username', {signed: true});
	res.redirect('/');
});

router.get('/phone', function(req, res) {
	if(req.query.passCode !== config.passCode) {
		res.json({errors: ['unknown error']});
		return;
	}
	User.findOne({username: req.query.username}, function(err, userFound) {
		if(err) {
			res.json({errors: ['unknown error']});
			return;
		};
		return res.json({phone: userFound.phone})
	})
})

//Route to which the form sends
router.post('/create', function(req, res) {
	var newUserObj = {
		username: req.body.username,
		password: req.body.password,
	}
	if(req.body.phone) {
		newUserObj.phone = req.body.phone;
	}
	var newUser = new User(newUserObj);
	newUser.save(function(err) {
		if(err) {
			if(err.code === 11000) {
				res.render('login', {
					errors: [
						'Username already exists'
					]
				})
			} else {
				res.render('createAccount', {
					errors: [
						'It\'s us, not you. Something went wrong on our end, so try again later.'
					]
				})
			}
		} else {
			res.cookie('loggedIn', true, {signed: true});
			res.cookie('username', req.body.username, {signed: true});
			res.redirect('/home')
		}
	});
});

module.exports = router;