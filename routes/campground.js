const express = require('express');
const router = express.Router();
const Campground = require('../models/campground');
const middleware = require('../middleware');

// INDEX route
router.get('/', (req, res) => {
    Campground.find({},
        (err, campgrounds) => {
            err ? console.log(`Find error: ${err}`) : res.render('campgrounds/index', {campgrounds});
        });
});

// CREATE route
router.post('/', middleware.isLoggedIn, (req, res) => {
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
router.get('/new', middleware.isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
});

// SHOW route
router.get('/:id', (req, res) => {
    Campground.findById(req.params.id).populate('comments').exec(function(err, campground){
        err ? console.log(err) : res.render('campgrounds/show', {campground});
    });
});

// EDIT route
router.get('/:id/edit', middleware.checkCampgroundOwnership, (req, res)=>{
    Campground.findById(req.params.id, (err, campground)=>{
        res.render('campgrounds/edit', {campground});
    });
});

// UPDATE route
router.put('/:id', middleware.checkCampgroundOwnership, (req, res)=>{    
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCampground)=>{
        if(err){
            res.redirect('/campgrounds');
        }
        else{
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

// DESTROY route
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res)=>{
    Campground.findByIdAndRemove(req.params.id, ()=>{
        res.redirect('/campgrounds')
    });
});

module.exports = router;