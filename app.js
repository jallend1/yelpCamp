const   express     = require('express'),
        app         = express(),
        bodyParser  = require('body-parser'),
        mongoose    = require('mongoose');

app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
mongoose.connect('mongodb://localhost/yelp_camp', {useNewUrlParser: true, useUnifiedTopology: true});

const campgroundSchema = new mongoose.Schema({
    name: String,
    image: String,
    description: String
});
const Campground = mongoose.model('Campground', campgroundSchema);

// Campground.create({
//     name: "Granite Hill",
//     image: "https://picsum.photos/200",
//     description: "Huge granite hill! No toilets."
// }, (err, newlyCreated) => {
//     err ? console.log('err') : console.log(`Created ${newlyCreated}`)
// });


app.get('/', function(req, res){
    res.render('landing');
});

// INDEX route
app.get('/campgrounds', (req, res) => {
    Campground.find({},
        (err, campgrounds) => {
            err ? console.log(`Find error: ${err}`) : res.render('index', {campgrounds});
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
    res.render('new');
});

// SHOW route
app.get('/campgrounds/:id', (req, res) => {
    Campground.findById(req.params.id, (err, foundCampground) =>{
        err ? console.log(err) : res.render('show', {campground: foundCampground});
    });
    // res.render('show');
});

app.listen('3000', () => console.log('The server is rockin!'));