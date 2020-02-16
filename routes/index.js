const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

// Root Route
router.get('/', function(req, res){
    res.render('landing');
});

// Authentication routes
// Show New User Page
router.get('/register', (req, res) => {
    res.render('register');
});

// Handle login logic
router.post('/register', (req, res,)=> {
    const newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, (err, user) => {
        if(err){
            console.log(err);
            return res.render('/register');}
        passport.authenticate('local')(req, res, () => {
            res.redirect('/campgrounds');
        });
    });
});

// Login Form
router.get('/login', (req, res)=>{
    res.render('login');
})
// Handle Login Logic
router.post('/login', 
    passport.authenticate('local', 
        {successRedirect: '/campgrounds', failureRedirect: '/login'})
);

// Logout
router.get('/logout', (req, res)=>{
    req.logout();
    res.redirect('/campgrounds');
});

module.exports = router;h