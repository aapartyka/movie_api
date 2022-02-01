// Importing the modules: express, morgan, body-parser, uuid.
const express = require('express');
const req = require('express/lib/request');
const morgan = require('morgan');
bodyParser = require('body-parser');
uuid = require('uuid');

// Adding express to the app.
const app = express();

// Use morgan for logging the requets (terminal).
app.use(morgan('common'));

// Parse incoming request bodies in the middleware.
app.use(bodyParser.json());

// array with the user and their information.
let users = [
    {
        id: 1,
        name: 'Arno',
        favoriteMovies: 'Shutter Island'
    },
    {
        id: 2,
        name: 'Blaise',
        favoriteMovies: 'We will never know'
    },
    {
        id: 3,
        name: 'Ramadhan',
        favoriteMovies: 'Maybe I ask him later'

    }
]

// TODO: add rating, release year, artist and short description.
// Array which contains the movies and their information.
let movies = [
    {
        title: 'Shutter Island',
        genre: {
            name: 'Psycho-Thriller',
        },
        director: 'Martin Scorsese',
        description: 'Add description here :D1'
    },
    {
        title: 'Ex Machina',
        director: 'Alex Garland',
        description: 'Add description here :D2'
    },
    {
        title: 'The Dark Knight',
        director: 'Christopher Nolan',
        description: 'Add description here :D3'
    },
    {
        title: 'The Shawshank Redemption',
        director: 'Stephen King',
        description: 'Add description here :D4'
    },
    {
        title: 'Pulp Fiction',
        director: 'Quentin Tarantino',
        description: 'Add description here :D5'
    },
    {
        title: 'The Pianist',
        director: 'Roman Polanski',
        description: 'Add description here :D6'
    },
    {
        title: 'Lord of the Rings The Fellowship of the Ring',
        director: 'Peter Jackson',
        description: 'Add description here :D7'
    },
    {
        title: 'Forrest Gump',
        director: 'Robert Zemeckis',
        description: 'Add description here :D8'
    },
    {
        title: 'The Godfather',
        director: 'Francis Ford Coppola',
        description: 'Add description here :D9'
    },
    {
        title: 'Star Wars V - The Empire Strikes back',
        director: 'Irvin Kershner',
        description: 'Add description here :D10'
    }
];

// Routing.
// CREATE: Create new user.
app.post('/users', (req, res) => {
    let newUser = req.body;

    if (!newUser.name) {
        const message = 'Missing name in request body';
        req.status(400).send(message);
    } else {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).send(newUser);
    }
});

// CREATE: Create new favorite movie of a user.
app.post('/users/:id/:movieTitle', (req, res) => {
    // add the favoriteMovie
    // if(!NewMovie) => res.status(400).send('New movie had not been created!')
    res.status(201).send('Movie was created successfully!')
});

// READ.
app.get('/', (req, res) => {
    res.send('Welcome to myFilx!');
});

// READ: Return all static files in public folder.
app.use(express.static('public'));

// READ: Get all movies
app.get('/movies', (req, res) => {
    res.status(200).json(movies).send('');
});

// READ: Get movies by title.
app.get('movies/:title', (req, res) => {
    res.status(200).send('Successful GET request returning movie(s) by tile.');
});

// READ: Get movies by genre.
app.get('movies/:genre', (req, res) => {
    res.status(200).send('Successful GET request returning movie(s) by genre.');
});

// READ: Get movies by director.
app.get('movies/:directors', (req, res) => {
    res.status(200).send('Successful GET request returning movie(s) by director.');
});

// UPDATE: Update user information.
app.put('/users/:id', (req, res) => {
    res.status(200).send('Successful updated user information.');
});

// DELETE: Delete user.
app.delete('/users/:id', (req, res) => {
    res.status(200).send('Successful DELETE request for the user.');
});

// DELETE: Delete/remove movie from the user's favorites list.
app.delete('users/:id/:movieTitle', (req, res) => {
    res.status(200).send('Successful DELETE reques for the favorite movie of the user.');
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