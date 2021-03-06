// Import and add express to the app.
const express = require('express');
const app = express();

// Import middlware libraries: morgan, body-parser.
const morgan = require('morgan');
const bodyParser = require('body-parser');

// Import CORS (Cross-Origin Resource Sharing).
const cors = require('cors');

// Import mogoose.
const mongoose = require('mongoose');

// Use body-parser for incoming request bodies in the middleware.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use morgan for logging the request data.
app.use(morgan('common'));

//Allow everyone to access the api.
app.use(cors());

// Import auth.js file. Handels Authentification.
let auth = require('./auth')(app);

// Conncecting to local MongoDB myFixDB.
/*mongoose.connect('mongodb://localhost:27017/myFlixDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
*/

// Conncecting to Cluster MongoDB myFixDB.
mongoose.connect(process.env.CONNECTION_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get('/', (req, res) => {
  res.send('Welcome to myFilx!');
});

const userRouter = require('./routes/users');
app.use('/users', userRouter);

const movieRouter = require('./routes/movies');
app.use('/movies', movieRouter);

// READ: Return all static files in public folder.
app.use(express.static('public'));

// Error handling/logging.
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).send('Something is not working!');
});

// Listen for requests on Port 8080.
const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => {
  console.log('listening on Port' + port);
});
