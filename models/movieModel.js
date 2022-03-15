const mongoose = require('mongoose');

let movieSchema = mongoose.Schema({
  Title: { type: String, required: true },
  Description: { type: String, required: true },
  Genre: {
    Name: String,
    Description: String,
  },
  Director: {
    Name: String,
    Bio: String,
  },
  Writer: [String],
  Releaseyear: Date,
  Actors: [String],
  ImagePath: String,
  Featured: Boolean,
});

let Movie = mongoose.model('Movie', movieSchema);

module.exports.Movie = Movie;
