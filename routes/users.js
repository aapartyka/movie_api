const express = require('express');
const router = express.Router();

// Import middlware libraries: morgan, body-parser, uuid.
bodyParser = require('body-parser');
uuid = require('uuid');

// Import mogoose and refering to the models which are defined in models.js.
const userModel = require('../models/userModel');
const Users = userModel.User;

const { check, validationResult } = require('express-validator');

// Require passport module & import passport.js file.
const passport = require('passport');
require('../passport');

router
  .route('')
  //READ: HTTP get request -> Get all users.
  .get(passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.find()
      .then((users) => {
        res.status(201).json(users);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).send('Error' + err);
      });
  })
  /* CREATE: HTTP post request -> Create new user.
  Allow new user to register.
  Mandatory fields: Username (min: 4 charakters), Password, E-mail. */
  .post(
    // Validation logic.
    [
      check('Username', 'Username is required').isLength({ min: 4 }),
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

router
  .route('/:Username')
  // READ: HTTP get request -> Get a user by username.
  .get(passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOne({ Username: req.params.Username })
      .then((user) => {
        res.json(user);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).send('Error: ' + err);
      });
  })
  // UPDATE: HTTP put request -> Update user information.
  .put(
    passport.authenticate('jwt', { session: false }),
    [
      check('Username', 'Username is required').isLength({ min: 4 }),
      check(
        'Username',
        'Username contains non alphanumeric characters - not allowed.'
      ).isAlphanumeric(),
      check('Password', 'Password is required').not().isEmpty(),
      check('Email', 'Email does not appear to be valid').isEmail(),
    ],

    (req, res) => {
      let hashedPassword = Users.hashPassword(req.body.Password);
      Users.findOneAndUpdate(
        { Username: req.params.Username },
        {
          $set: {
            Username: req.body.Username,
            Password: hashedPassword,
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
    }
  )
  // DELETE: HTTP delete request -> Delete user by username.
  .delete(passport.authenticate('jwt', { session: false }), (req, res) => {
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

// CREATE: HTTP post request -> Add a new favorite movie of a user.
router
  .route('/:Username/:MovieID')
  .post(passport.authenticate('jwt', { session: false }), (req, res) => {
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
  })
  //DELETE: HTTP delete request -> Remove a movie from a user's favorite movie list.
  .delete(passport.authenticate('jwt', { session: false }), (req, res) => {
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
  });

router
  //CREATE: HTTP post request -> Add a new movie to watch in a user's watchlist.
  .route('/:Username/watchlist/:movieID')
  .post(passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $push: { Watchlist: req.params.movieID } },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.log(err);
          res.status(500).send('Error');
        } else {
          res.json(updatedUser);
        }
      }
    );
  })
  // DELETE: HTTP delete request -> Remove a movie from a user's watchlist.
  .delete(passport.authenticate('jwt', { session: false }), (req, res) => {
    Users.findOneAndUpdate(
      { Username: req.params.Username },
      { $pull: { Watchlist: req.params.movieID } },
      { new: true },
      (err, updatedUser) => {
        if (err) {
          console.error(err);
          res.status(500).send('Error');
        } else {
          res.json(updatedUser);
        }
      }
    );
  });

module.exports = router;
