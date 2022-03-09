// Import and add express to the app.
const express = require('express');
const app = express();

// Import middlware libraries: morgan, body-parser, uuid.
const morgan = require('morgan');
bodyParser = require('body-parser');
uuid = require('uuid');

// Import CORS (Cross-Origin Resource Sharing).
const cors = require('cors');

// Use body-parser for incoming request bodies in the middleware.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { check, validationResult } = require('express-validator');

// Import mogoose and refering to the models which are defined in models.js.
const mongoose = require('mongoose');
const Models = require('./models.js');
const Movies = Models.Movie;
const Users = Models.User;

let allowedOrigins = [
  'http://localhost:8080',
  'http://testsite.com',
  'http://localhost:1234',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        // If a specific origin isn't found on the list of of allowed origins.
        let message =
          'The CORS policy for this application dosen´t allow access from' +
          origin;
        return callback(null, true);
      }
      return callback(null, true);
    },
  })
);

// Import auth.js file.
let auth = require('./auth')(app);

// Require passport module & import passport.js file.
const passport = require('passport');
require('./passport');

// Use morgan for logging the request data.
app.use(morgan('common'));

// Conncecting to MongoDB myFixDB.
mongoose.connect('mongodb://localhost:27017/myFixDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routing.
// READ.
app.get('/', (req, res) => {
  res.send('Welcome to myFilx!');
});

// READ: Return all static files in public folder.
app.use(express.static('public'));

/* CREATE: Create new user.
  Allow new user to register.
  Mandatory fields: Username (min: 5 charakters), Password, E-mail.
*/
app.post(
  '/users',
  // Validation logic.
  [
    check('Username', 'Username is required').isLength({ min: 5 }),
    check(
      'Username',
      'Username contains non alphanumeric characters - not allowed.'
    ).isAlphanumeric(),
    check('Password', 'Password is required').not().isEmpty(),
    check('Email', 'Email does not appear to be valid').isEmail(),
  ],
  (req, res) => {
    // check the validation object for errors
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }

    Users.findOne({ Username: req.body.Username }) // Search to see if a user with the requested username already exists.
      .then((user) => {
        // If the user is found, send a response that it already exists.
        if (user) {
          return res.status(400).send(req.body.Username + 'already exists!');
        } else {
          // If the user doesn't exists, a new user document will be created in the users collection.
          let hashedPassword = Users.hashPassword(req.body.Password);
          Users.create({
            Username: req.body.Username,
            Password: hashedPassword,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          })
            // This callback takes the created document as a parameter.
            .then((user) => {
              res.status(201).json(user);
            })
            .catch((error) => {
              console.error(error);
              res.status(500).send('Error: ' + error);
            });
        }
      })
      .catch((error) => {
        console.error(error);
        res.status(500).send('Error: ' + error);
      });
  }
);

//READ: Get all users.
app.get(
  '/users',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Error' + err);
      });
  }
);

// READ: Get a user by username
app.get(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// UPDATE: Update userinformation.
app.put(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  [
    check(
      'Username',
      'A Username is required have to have at least four characters.'
    ).isLength({ min: 4 }),
    check(
      'Username',
      'A Username is only allowed to contain alphanumeric characters.'
    ).isAlphanumeric,
    check('Password', 'A password is required!').not().isEmpty,
    check('Email', 'The email does not aßßer to be vaild ').isEmail(),
  ],
  (req, res) => {
    // Check the validation object for errors.
    let errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    (req, res) => {
      Users.findOneAndUpdate(
        { Username: req.params.Username },
        {
          $set: {
            Username: req.body.Username,
            Password: req.body.Password,
            Email: req.body.Email,
            Birthday: req.body.Birthday,
          },
        },
        { new: true }, // This line makes sure that the updated document is returned.
        (err, updatedUser) => {
          if (err) {
            console.error(err);
            res.status(500).send('Error: ' + err);
          } else {
            res.json(updatedUser);
          }
        }
      );
    };
  }
);

// DELETE: Delete user by username.
app.delete(
  '/users/:Username',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
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
  }
);

// CREATE: Create new favorite movie of a user.
app.post(
  '/users/:Username/:MovieID',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $push: { FavoriteMovies: req.params.MovieID } },
      { new: true }, // this line makes sure that the updated document is returned.
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// deletes a movie from a user's list.
app.delete(
  '/users/:Username/:MovieID',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { FavoriteMovies: req.params.MovieID } },
      { new: true }, // this line makes sure that the updated document is returned
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error: ' + err);
        } else {
          res.json(updatedUser);
        }
      }
    );
  }
);

// READ: Get all movies
app.get(
  '/movies',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.find()
      .then((movies) => {
        res.status(201).json(movies);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// READ: Get movies by title.
app.get(
  '/movies/:Title',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ Title: req.params.Title })
      .then((movie) => {
        res.json(movie);
      })
      .catch((err) => {
        res.status(500).send('Error: ' + err);
      });
  }
);

// READ: Get description of a genre.
app.get(
  '/movies/genres/:Name',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ 'Genre.Name': req.params.Name })
      .then((movie) => {
        res.json(movie.Genre.Description);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// READ: Get information about a director.
app.get(
  '/movies/directors/:Name',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    Movies.findOne({ 'Director.Name': req.params.Name })
      .then((movie) => {
        res.json(movie.Director);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  }
);

// Error handling/logging.
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('Something is not working!');
});

// Listen for requests on Port 8080.
app.listen(8080, () => {
  console.log('listening on port 8080');
});
