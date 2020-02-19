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
    Campground.findById(req.params.id).populate('comments').exec(function(err, campground){
        err ? console.log(err) : res.render('campgrounds/show', {campground});
    });
});

// EDIT route
router.get('/:id/edit', checkCampgroundOwnership, (req, res)=>{
    Campground.findById(req.params.id, (err, campground)=>{
        res.render('campgrounds/edit', {campground});
    });
});

// UPDATE route
router.put('/:id', checkCampgroundOwnership, (req, res)=>{    
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
router.delete('/:id', checkCampgroundOwnership, (req, res)=>{
    Campground.findByIdAndRemove(req.params.id, ()=>{
        res.redirect('/campgrounds')
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect('/login');
}

function checkCampgroundOwnership(req, res, next){
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, (err, campground)=>{
            if(err){
                res.redirect('back');
            }else{
                if(campground.author.id.equals(req.user._id)){
                    next();
                }
                else{
                    res.redirect('back');
                }
            }
        });
    }
    else{
        res.redirect('back');
    }
}

module.exports = router;