var express = require('express');
var router = express.Router();
var User = require('../models/user.js');

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


router.get('/logout', function(req, res) {
	res.cookie('loggedIn', false, {signed: true});
	res.clearCookie('username', {signed: true});
	res.redirect('/');
});

//Route to which the form sends
router.post('/create', function(req, res) {
	var newUser = new User({
		username: req.body.username,
		password: req.body.password
	});
	newUser.save(function(err) {
		if(err) {
			if(err.code === 11000) {
				res.render('login', {
					errors: [
						'Username already exists'
					]
				})
			} else {
				res.render('login', {
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
})

module.exports = router;