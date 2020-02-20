const express = require('express');
const router = express.Router({mergeParams: true});
const Campground = require('../models/campground');
const Comment = require('../models/comment');

// Comments New
router.get('/new', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        err ? console.log(err) : res.render('comments/new', {campground});
    });
});

// Comments Create
router.post('/', isLoggedIn, (req, res) => {
    Campground.findById(req.params.id, (err, campground)=> {
        if(err){
            console.log(err);
            res.redirect('/campgrounds');
        }
        else{
            Comment.create(req.body.comment, (err, comment) => {
            if(err){
                console.log(err);
            }
            else{
                // add username and ID to comment
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                comment.save();
                campground.comments.push(comment);
                campground.save();
                res.redirect(`/campgrounds/${campground._id}`);
            }
            });
        }
    });
});

// EDIT Route
router.get('/:commentID/edit', (req, res) =>{
    Comment.findById(req.params.commentID, (err, foundComment)=>{
        if(err){
            res.redirect('back');
        }
        else{
            res.render('comments/edit', {campgroundID: req.params.id, comment: foundComment});
        }
    });
});

// UPDATE Route
router.put('/:commentID', (req, res)=>{
    Comment.findByIdAndUpdate(req.params.commentID, req.body.comment, (err, updatedComment)=>{
        if(err){
            res.redirect('back');
        }
        else{
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

// DESTROY Route
router.delete('/:comment_id', (req, res)=>{
    Comment.findByIdAndRemove('req.params.comment_id', (err)=>{
        if(err){
            res.redirect('back');
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