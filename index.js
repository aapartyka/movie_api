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
// READ.
app.get('/', (req, res) => {
    res.send('Welcome to myFilx!');
});

// READ: Return all static files in public folder.
app.use(express.static('public'));

//CREATE: Create new user.
app.post('/users', (req, res) => {
    Users.findOne({ Username: req.body.Username })
    .then((user) => {
        // If the user already exsists, the message will be returned.
        if (user) {
            return res.status(400).send(rep.body.Username + 'already exists');
        } else {
            // If the user doesn't exists, a new user document will be vreated in the users collection.
            Users
                .create({
                    Username: req.body.Username,
                    Password: req.body.Password,
                    Email: req.body.Email,
                    Birthday: req.body.Birthday
                })
                // This callback takes the created document as a parameter.
                .then((user) => {
                    res.status(201).json(user)
                })
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

// UPDATE: Update userinformation.
app.put('/users/:Username', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, { $set:
      {
        Username: req.body.Username,
        Password: req.body.Password,
        Email: req.body.Email,
        Birthday: req.body.Birthday
      }
    },
    { new: true }, // This line makes sure that the updated document is returned.
    (err, updatedUser) => {
      if(err) {
        console.error(err);
        res.status(500).send('Error: ' + err);
      } else {
        res.json(updatedUser);
      }
    });
  });

// DELETE: Delete user by username.
app.delete('/users/:Username', (req, res) => {
    Users.findOneAndDelete({ Username: req.params.Username })
        .then((user) => {
            if (!user) {
                res.status(400).send(req.params.Username + ' was not found.');
            } else {
                // status code 200 = OK
                res.status(200).send(req.params.Username + ' was deleted.');
            }
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// CREATE: Create new favorite movie of a user.
app.post('/users/:id/:movieTitle', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, 
        { $push: { FavoriteMovies: req.params.movieTitle }
    },
    { new: true }, // this line makes sure that the updated document is returned.
    (err, updatedUser) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
});

app.delete('/users/:Username/:movieTitle', (req, res) => {
    Users.findOneAndUpdate({ Username: req.params.Username }, 
        { $pull: { FavoriteMovies: req.params.movieTitle }
    },
    { new: true }, // this line makes sure that the updated document is returned.
    (err, updatedUser) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
        } else {
            res.json(updatedUser);
        }
    });
}); 

// READ: Get all movies
app.get('/movies', (req, res) => {
    Movies.find()
        .then((movies) => {
            res.status(201).json(movies);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
});

// READ: Get movies by title.
app.get('/movies/:Title', (req, res) => {
    Movies.findOne({ Title: req.params.Title })
        .then((movie) => {
            res.json(movie);
        })
        .catch((err) => {
            res.status(500).send('Error: ' + err);
        });
});

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

// READ: Get description of a genre.
app.get('/movies/genre/:Name', (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.Name })
        .then((movie) => {
            res.json(movie.Genre.Description);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
})

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

// gets information about a director
app.get('/movies/director/:Name', (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.Name })
        .then((movie) => {
            res.json(movie.Director);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send('Error: ' + err);
        });
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