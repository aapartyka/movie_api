const passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    Models= requore('./models.js'),
    passportJWT = requore('passport-jwt');

let Users = Models.User,
    JWTStrategy = passportJWT.Strategy,
    ExtractJWT = passportJWT,ExtractJWT;

    