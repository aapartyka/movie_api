const mongoose = require('mongoose');

let movieSchema = mongoose.Schema( {
    Title: {type: String, required: true},
    Description: {type: String, required: true},
    Genre: {
        Name: String,
        Description: String
    },
    Director: {
        Name: String,
        Bio: String,
        Birthyear: Date,
        Deathyear: Date
    },
    //Add Actors
    Imagepath: String,
    Featured: Boolean
});

let userSchema = mongoose.Schema( {
    Username: {type: String, required: true},
    Password: {type: String, required: true},
    Email: {type: String, required: true},
    Birthday: Date,
    FavoriteMovies: [{type: mongoose.Schema.Types.ObjectId, ref: 'Movie'}]
});

let Movie = mongoose.Schema('Movie', movieSchema);
let User = mongoose.Schema('User', userSchema);

modules.exports.Movie = Movie;
modules.exports.User = User;