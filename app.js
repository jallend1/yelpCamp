const   express         = require('express'),
        app             = express(),
        bodyParser      = require('body-parser'),
        mongoose        = require('mongoose'),
        Campground      = require('./models/campground'),
        Comment         = require('./models/comment'),
        passport        = require('passport'),
        LocalStrategy   = require('passport-local'),
        expressSession  = require('express-session'),
        User            = require('./models/user'),
        methodOverride  = require('method-override'),
        flash           = require('connect-flash');

// Requiring Routes
const   commentRoutes       = require('./routes/comments'),
        campgroundRoutes    = require('./routes/campground'),
        indexRoutes         = require('./routes/index');
        
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
app.use(methodOverride('_method'));

const url = process.env.DATABASEURL || 'mongodb://localhost/yelp_camp';
mongoose.connect(process.env.DATABASEURL, 
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        useCreateIndex: true
    }).then(()=> {
        console.log('Connected to DB!');
    }).catch(err => {
        console.log(`Error: ${err.message}`);
});

app.use(flash());
        
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
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

app.use(indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments', commentRoutes);

app.listen(process.env.PORT || '3000', () => console.log('The server is rockin!'));