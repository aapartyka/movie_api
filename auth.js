const jwtSecret = 'your_jwt_secret'; // This has to be the same key used in the JWTStrategy

const jwt = require('jsonwebtoken'),
  passport = require('passport');

require('./passport'); // passport.js with HTTP- and JWT-Strategy.

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, // Username which will be encoded in JWT.
        expiresIn: '6d', // Specifies the expiration of the JWT token to 6 days.
        algorithm: 'HS256' // The HMAC (keyed-hash message authentication code) which is used to "sign"/encode the values of the JWT token.
    });
}

/* POST login. */
module.exports = (router) => {
  router.post('/login', (req, res) => {
    passport.authenticate('local', { session: false }, (error, user, info) => {
      if (error || !user) {
        return res.status(400).json({
          message: 'Something is not right',
          user: user
        });
      }
      req.login(user, { session: false }, (error) => {
        if (error) {
          res.send(error);
        }
        let token = generateJWTToken(user.toJSON());
        return res.json({ user, token }); // ES6 shorthand for res.json({ user: user, token: token }).
      });
    })(req, res);
  });
}