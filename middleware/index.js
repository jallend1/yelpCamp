const middlewareObj = {};
const Campground = require('../models/campground');
const Comment = require('../models/campground');

middlewareObj.checkCampgroundOwnership = function(req, res, next){
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
        }else{
            res.redirect('back');
        }
}

middlewareObj.checkCommentOwnership = function (req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.commentID, (err, foundComment)=>{
            if(err){
                res.redirect('back');
            }else{
                if(foundComment.author.id.equals(req.user._id)){
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

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash('error', 'Please login first!');
    res.redirect('/login');
}

module.exports = middlewareObj;