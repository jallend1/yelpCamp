const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');

// INDEX route
router.get('/', (req, res) => {
    Campground.find({},
        (err, campgrounds) => {
            err ? console.log(`Find error: ${err}`) : res.render('campgrounds/index', {campgrounds});
        });
});

// CREATE route
router.post('/', isLoggedIn, (req, res) => {
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    const newCampground = {name, image, description, author};
    Campground.create(newCampground, (err, newlyCreated) => {
        err ? console.log(`Post error: ${err}`) : res.redirect('/campgrounds');
    })
});

// NEW route
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

// SHOW route
router.get('/:id', (req, res) => {
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        err ? console.log(err) : res.render('campgrounds/show', {campground: foundCampground});
    });
});

// EDIT route
router.get('/:id/edit', (req, res)=>{
    Campground.findById(req.params.id, (err, foundCampground)=>{
        err ? res.redirect('/campgrounds') : res.render('campgrounds/edit', {campground: foundCampground});
    });
});

// UPDATE route
router.put('/:id', (req, res)=>{    
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=>{
        if(err){
            res.redirect('/campgrounds');
        }
        else{
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

module.exports = router;