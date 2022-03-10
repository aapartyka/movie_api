const express = require('express');
const router = express.Router();

// Import middlware libraries: morgan, body-parser, uuid.
bodyParser = require('body-parser');
uuid = require('uuid');

// Import mogoose and refering to the models which are defined in models.js.
//const Models = require('../models.js');
//const Movies = Models.Movie;

const movieModel = require('../models/movieModel');
const Movies = movieModel.Movie;

// Require passport module & import passport.js file.
const passport = require('passport');
require('../passport');

// READ: Get all movies
router.get(
  '/',
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
router.get(
  '/:Title',
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
router.get(
  '/genres/:Name',
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
router.get(
  '/directors/:Name',
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

module.exports = router;
