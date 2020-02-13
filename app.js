const   express     = require('express'),
        app         = express(),
        bodyParser  = require('body-parser'),
        mongoose    = require('mongoose'),
        Campground  = require('./models/campground'),
        Comment     = require('./models/comment');
        seedDB      = require('./seeds');
        // User        = require('./models/user');

seedDB();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true});

app.get('/', function(req, res){
    res.render('landing');
});

// INDEX route
app.get('/campgrounds', (req, res) => {
    Campground.find({},
        (err, campgrounds) => {
            err ? console.log(`Find error: ${err}`) : res.render('campgrounds/index', {campgrounds});
        });
});


// CREATE route
app.post('/campgrounds', (req, res) => {
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const newCampground = {name, image, description};
    Campground.create(newCampground, (err, newlyCreated) => {
        err ? console.log(`Post error: ${err}`) : res.redirect('/campgrounds');
    })
});

// NEW route
app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new');
});

// SHOW route
app.get('/campgrounds/:id', (req, res) => {
    Campground.findById(req.params.id).populate('comments').exec(function(err, foundCampground){
        err ? console.log(err) : res.render('campgrounds/show', {campground: foundCampground});
    });
});

// COMMENTS ROUTES
app.get('/campgrounds/:id/comments/new', (req, res) => {
    Campground.findById(req.params.id, (err, campground) => {
        err ? console.log(err) : res.render('comments/new', {campground});
    });
});

app.post('/campgrounds/:id/comments', (req, res) => {
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
                campground.comments.push(comment);
                campground.save();
                res.redirect(`/campgrounds/${campground._id}`);
            }
            });
        }
    });
});

app.listen('3000', () => console.log('The server is rockin!'));