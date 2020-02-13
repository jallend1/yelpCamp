const mongoose      = require('mongoose');
const Campground    = require('./models/campground');
const Comment       = require('./models/comment');

const data = [
    {name: "Cloud's Rest", 
    image: "https://picsum.photos/300",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {name: "Desert Mesa", 
    image: "https://picsum.photos/300",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    },
    {name: "Canyon Floor", 
    image: "https://picsum.photos/300",
    description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    }
];

function seedDB(){ // Remove then add some campgrounds
    Campground.remove({}, function(err){
        err ? console.log('err') : console.log('Removed campgrounds!')
        Comment.remove({}, function(err){
            err ? console.log('err') : console.log('Removed comments!');
        });
        data.forEach(seed => {
            Campground.create(seed, function(err, campground){
                if(err){
                    console.log(err)
                }
                else{
                    console.log('Added a campground!');
                    Comment.create(
                        {
                            text: "This place is the best!",
                            author: "Homer"
                        },
                        (err, comment) => {
                            if(err){
                                console.log(err)
                            }
                            else{
                                campground.comments.push(comment);
                                campground.save();
                                console.log('Created new comment');
                            }
                        }
                    );
                }
            });
        });
    });
}

module.exports = seedDB;