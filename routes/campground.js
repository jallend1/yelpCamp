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
router.post('/', (req, res) => {
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const newCampground = {name, image, description};
    Campground.create(newCampground, (err, newlyCreated) => {
        err ? console.log(`Post error: ${err}`) : res.redirect('/campgrounds');
    })
});

// NEW route
router.get('/new', (req, res) => {
    res.render('campgrounds/new');
});

// SHOW route
router.get('/:id', (req, res) => {
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        err ? console.log(err) : res.render('campgrounds/show', {campground: foundCampground});
    });
});

module.exports = router;