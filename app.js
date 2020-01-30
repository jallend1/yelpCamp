const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: true}));

const campgrounds = [
    {name: 'Salmon Creek', image: "https://picsum.photos/200"},
    {name: 'Mountain Rest', image: "https://picsum.photos/200"},
    {name: 'Beaver Creek', image: "https://picsum.photos/200"}
];

app.set('view engine', 'ejs');

app.get('/', function(req, res){
    res.render('landing');
});

app.get('/campgrounds', (req, res) => {
    res.render('campgrounds', {campgrounds});
});

app.post('/campgrounds', (req, res) => {
    const name = req.body.name;
    const image = req.body.image;
    const newCampground = {name, image};
    campgrounds.push(newCampground);
    res.redirect('/campgrounds');
});

app.get('/campgrounds/new', (req, res) => {
    res.render('new');
});

app.listen('3000', () => console.log('The server is rockin!'));