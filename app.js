const   express         = require('express'),
        app             = express(),
        bodyParser      = require('body-parser'),
        mongoose        = require('mongoose'),
        Campground      = require('./models/campground'),
        Comment         = require('./models/comment'),
        seedDB          = require('./seeds'),
        passport        = require('passport'),
        LocalStrategy   = require('passport-local'),
        expressSession  = require('express-session'),
        User            = require('./models/user'),
        methodOverride  = require('method-override');

// Requiring Routes
const   commentRoutes       = require('./routes/comments'),
        campgroundRoutes    = require('./routes/campground'),
        indexRoutes         = require('./routes/index');

// seedDB();  // Seeds the database
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));
mongoose.connect('mongodb://localhost/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true});

// Passport Config
app.use(expressSession({
    secret: "Pern is orange!",
    resave: false,
    saveUnitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next)=>{
    res.locals.currentUser = req.user;
    next();
});

app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen('3000', () => console.log('The server is rockin!'));