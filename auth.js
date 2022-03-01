const jwtSecret = 'your_jwt_secret'; // Same key as used in the JWTStrategy.

const jwt = require('jsonwebtoken'),
    passport = require('passport');

require('./passport'); // passport.js with HTTP- and JWT-Strategy.

let generateJWTToken = (user) => {
    return jwt.sign(user, jwtSecret, {
        subject: user.Username, // Username which will be encoded in JWT.
        expiresIn: '5d', // Specifies the expiration of the JWT token to 5 days.
        algorithm: 'HS256' // The HMAC (keyed-hash message authentication code) which is used to "sign"/encode the values of the JWT token.
    });
}
