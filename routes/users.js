const express = require('express');
const router = express.Router();

// Import middlware libraries: morgan, body-parser, uuid.
bodyParser = require('body-parser');
uuid = require('uuid');

// Import mogoose and refering to the models which are defined in models.js.
const Models = require('../models.js');
const Users = Models.User;

const { check, validationResult } = require('express-validator');

// Require passport module & import passport.js file.
const passport = require('passport');
require('../passport');

/* CREATE: Create new user.
  Allow new user to register.
  Mandatory fields: Username (min: 5 charakters), Password, E-mail.
*/
router.post(
  '/',
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
router.get('', passport.authenticate('jwt', { session: false }), (req, res) => {
  Users.find()
    .then((users) => {
      res.status(201).json(users);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send('Error' + err);
    });
});

// READ: Get a user by username
router.get(
  '/:Username',
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
router.put(
  '/:Username',
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
router.delete(
  '/:Username',
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
router.post(
  '/:Username/:MovieID',
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
router.delete(
  '/:Username/:MovieID',
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

module.exports = router;
