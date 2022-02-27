// Importing the modules: mongoose, express, morgan, body-parser, uuid.
const mongoose = require('mongoose');
const Models = require('./models.js');
const express = require('express');
const morgan = require('morgan');
const { get } = require('express/lib/response');
bodyParser = require('body-parser');
uuid = require('uuid');

// Adding express to the app.
const app = express();

// Use morgan for logging the requets (terminal).
app.use(morgan('common'));

// Parse incoming request bodies in the middleware.
app.use(bodyParser.json());

const Movies = Models.movie;
const Users = Models.user;

mongoose.connect('mongodb://localhost:27017/myFix', {useNewUrlParser: true, useUnifiedToplogy: true});

// Routing.
//Create: new User
app.post('/users', (req, res) => {
    Users.findOne({ Username: req.body.Username })
      .then((user) => {
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists');
        } else {
          Users
            .create({
              Username: req.body.Username,
              Password: req.body.Password,
              Email: req.body.Email,
              Birthday: req.body.Birthday
            })
            .then((user) =>{res.status(201).json(user) })
          .catch((error) => {
            console.error(error);
            res.status(500).send('Error: ' + error);
          })
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  });

// CREATE: Create new favorite movie of a user.
app.post('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
    let user = Users.find( user => user.id == id );

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
    res.status(200).json(Movies);
})

// READ: Get movies by title.
app.get('/movies/:title', (req, res) => {
    const { title } = req.params;
    const movie = Movies.find ( movie => movie.Title === title );

    if (movie) {
        res.status(200).json(movie);
    } else {
        res.status(400).send('There is no movie with such title.');
    }
})

// READ: Get movies by genre.
app.get('/movies/genres/:genreName', (req, res) => {
    const { genreName } = req.params;
    const genre = Movies.find ( movie => movie.Genre === genreName);

    if (genre) {
        res.status(200).json(genre);
    } else {
        res.status(400).send('There is no ge with such name.');
    }
})

//READ: Get all users.
app.get('/users', (req, res) => {
    Users.find().then
    .then((users) => {
        res.status(201).json(users);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send('Error' + err);
    });
});

// READ: Get a user by username
app.get('/users/:Username', (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  });

// READ: Get movies by director.
app.get('/movies/directors/:directorName', (req, res) => {
    const { directorName } = req.params;
    const director = Movies.find ( movie => movie.Director === directorName );

    if (director) {
        res.status(200).json(director);
    } else {
        res.status(400).send('There is no director with such name.');
    }
})

// UPDATE: Update user information by id.
app.put('/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedUser = req.body;
    let user = Users.find(user => user.id == id);

    if (user) {
        user.name = updatedUser.name;
        // status code 200 = OK
        res.status(200).json(user);
    } else {
        res.status(400).send('no such user');
    }
});

// DELETE: Delete user.
app.delete('/users/:id', (req, res) => {
    const { id } = req.params;
    let user = Users.find(user => user.id == id);

    if (user) {
        Users = user.filter(user => user.id != id)
        // status code 200 = OK
        res.status(200).send(`${user.name} has been deleted`);
    } else {
        res.status(400).send('no such user');
    }
});

// DELETE: Delete/remove movie from the user's favorites list.
app.delete('/users/:id/:movieTitle', (req, res) => {
    const { id, movieTitle } = req.params;
    let user = Users.find(user => user.id == id);

    if (user) {
        user.toWatch = user.toWatch.filter(title => title !==  movieTitle);
        // status code 200 = OK
        res.status(200).send(`${movieTitle} has been removed from ${user.name}'s array`);
    } else {
        res.status(400).send('no such user');
    }
});

//Erorr logging
app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Something is not working!');
});

//listen for requests
app.listen(8080, () => {
    console.log('listening on port 8080');
});