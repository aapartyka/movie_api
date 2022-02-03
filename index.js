// Importing the modules: express, morgan, body-parser, uuid.
const express = require('express');
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
        favoriteMovies: ['Shutter Island']
    },
    {
        id: 2,
        name: 'Blaise',
        favoriteMovies: ['We will never know']
    },
    {
        id: 3,
        name: 'Ramadhan',
        favoriteMovies: ['Maybe I ask him later']
    }
]

// TODO: add rating, release year, artist and short description.
// Array which contains the movies and their information.
let movies = [
    {
        Title: 'Shutter Island',
        Genre: 'Thriller',
        Director: 'Martin Scorsese',
        Description: 'Add description here :D1',
    },
    {
        Title: 'Ex Machina',
        Genre: 'testGenre',
        Director: 'Alex Garland',
        Description: 'Add description here :D2'
    },
    {
        Title: 'The Dark Knight',
        Genre: 'testGenre',
        Director: 'Christopher Nolan',
        Description: 'Add description here :D3'
    },
    {
        Title: 'The Shawshank Redemption',
        Genre: 'testGenre',
        Director: 'Stephen King',
        Description: 'Add description here :D4'
    },
    {
        Title: 'Pulp Fiction',
        Genre: 'testGenre',
        Director: 'Quentin Tarantino',
        Description: 'Add description here :D5'
    },
    {
        Title: 'The Pianist',
        Genre: 'testGenre',
        Director: 'Roman Polanski',
        Description: 'Add description here :D6'
    },
    {
        Title: 'Lord of the Rings The Fellowship of the Ring',
        Genre: 'testGenre',
        Director: 'Peter Jackson',
        Description: 'Add description here :D7'
    },
    {
        Title: 'Forrest Gump',
        Genre: 'testGenre',
        Director: 'Robert Zemeckis',
        Description: 'Add description here :D8'
    },
    {
        Title: 'The Godfather',
        Genre: 'testGenre',
        Director: 'Francis Ford Coppola',
        Description: 'Add description here :D9'
    },
    {
        Title: 'Star Wars V - The Empire Strikes back',
        Genre: 'testGenre',
        Director: 'Irvin Kershner',
        Description: 'Add description here :D10'
    }
];

// Routing.
// CREATE: Create new user.
app.post('/users', (req, res) => {
    const newUser = req.body;

    if (newUser) {
        newUser.id = uuid.v4();
        users.push(newUser);
        res.status(201).json(newUser);
    } else {
        res.status(400).send('A users need a name.');
    }
});

// CREATE: Create new favorite movie of a user.
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
    let user = users.find( user => user.id == id );

    if (user) {
        user.favoriteMovies.push(movieTitle);
        res.status(200).send(`${movieTitle} has been added to ${id}'s movies!`);
    } else {
        res.status(400).send('No user with that ID.');
    }
});

// READ.
app.get('/', (req, res) => {
    res.send('Welcome to myFilx!');
});

// READ: Return all static files in public folder.
app.use(express.static('public'));

// READ: Get all movies
app.get('/movies', (req, res) => {
    res.status(200).json(movies);
})

// READ: Get movies by title.
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = movies.find ( movie => movie.Title === title );

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('There is no movie with such title.');
    }
})

// READ: Get movies by genre.
app.get('/movies/genres/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = movies.find ( movie => movie.Genre === genreName);

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('There is no ge with such name.');
    }
})

// READ: Get movies by director.
app.get('/movies/directors/:directorName', (req, res) => {
    console.log('test');
    const { directorName } = req.params;
    const director = movies.find ( movie => movie.Director === directorName );

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('There is no director with such name.');
    }
})

// UPDATE: Update user information.
app.put('/users/:id', (req, res) => {
    res.status(200).send('Successful updated user information.');
})

// DELETE: Delete user.
app.delete('/users/:id', (req, res) => {
    res.status(200).send('Successful DELETE request for the user.');
})

// DELETE: Delete/remove movie from the user's favorites list.
app.delete('/users/:id/:movieTitle', (req, res) => {
    res.status(200).send('Successful DELETE reques for the favorite movie of the user.');
})

//Erorr logging
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Something is not working!');
});

//listen for requests
app.listen(8080, () => {
    console.log('listening on port 8080');
});