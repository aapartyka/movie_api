const express = require('express');
const morgan = require('morgan');

const app = express();

app.use(morgan('common'));

// TODO: add rating, release year, artist and short description.
let top10movies = [
    {
        title: 'Shutter Island',
        director: 'Martin Scorsese'
    },
    {
        title: 'Ex Machina',
        director: 'Alex Garland'
    },
    {
        title: 'The Dark Knight',
        director: 'Christopher Nolan'
    },
    {
        title: 'The Shawshank Redemption',
        director: 'Stephen King'
    },
    {
        title: 'Pulp Fiction',
        director: 'Quentin Tarantino'
    },
    {
        title: 'The Pianist',
        director: 'Roman Polanski'
    },
    {
        title: 'Lord of the Rings The Fellowship of the Ring',
        director: 'Peter Jackson'
    },
    {
        title: 'Forrest Gump',
        director: 'Robert Zemeckis'
    },
    {
        title: 'The Godfather',
        director: 'Francis Ford Coppola'
    },
    {
        title: 'Star Wars V - The Empire Strikes back',
        director: 'Irvin Kershner'
    }
];

//GET requests
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.send('Welcome to myFilx!');
});

app.get('/movies', (req, res) => {
    res.json(top10movies);
});

//Erorr logging
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Something is not working!');
})

//listen for requests
app.listen(8080, () => {
    console.log('listening on port 8080');
});