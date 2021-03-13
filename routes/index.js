var express = require('express');
var passport = require('passport');
var router = express.Router();
var upicture = require('../models/proflastpic');
var fs = require('fs');
router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/login', function (req, res, next) {
    res.render('login.html', { message: req.flash('loginMessage') });
});

router.get('/signup', function (req, res) {
    res.render('signup.html', { message: req.flash('signupMessage') });
});

router.get('/profile', isLoggedIn,async function (req, res) {
    // console.log(req.user.ppic.picPath);
    await upicture.findOne({ usId: req.user._id }).sort({ addDate: -1 }).limit(1).exec(function (err, data) {
        if (data) {
            res.render('profile.html', { user: req.user, ppath: req.user._id + '/' + data.picPath });
        }
        else if (err) {
            res.status(err.status || 500);
            res.render('error', {
                message: 'Profile picture not found!',
                error: {},
            });
        } 
        else {
            res.render('profile.html', { user: req.user, ppath: '../imgdata/profimg/prof.png' });
        }
    });
    
});

router.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});

router.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true,
}));

router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile',
    failureRedirect: '/login',
    failureFlash: true,
}));

router.get('/auth/facebook', passport.authenticate('facebook', { scope: 'email' }));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  successRedirect: '/profile',
  failureRedirect: '/',
}));

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/profile',
    failureRedirect: '/',
}));

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/profile',
    failureRedirect: '/',
}));


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
    return next();
    res.redirect('/');
}

module.exports = router;