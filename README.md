# MyFlix-Movie_API

Movie_api is the Server-side component of a movies database web application. The web
application provides users with access to information about different
movies, directors, and genres. Users are able to sign up, update their
personal information, and create a list of their favorite movies.

## User Stories

- As a user, I want to be able to receive information on movies, directors, and genres so that I
can learn more about movies I’ve watched or am interested in.
- As a user, I want to be able to create a profile so I can save data about my favorite movies.
- As a user, I want to be able to add movies to a watchlist and remove them after watching them. 

## Features

- Return a list of ALL movies to the user.
- Return data (description, genre, director, writer, actors, releaseyear, image URL,) about a
  single movie by title to the user.
- Return data about a genre (description) by name/title (e.g., “Comedy”).
- Return data about a director (bio, birth year, death year) by name.
- Allow new users to register.
- Allow users to update their user info (username, password, email, date of birth).
- Allow users to add a movie to their list of favorites.
- Allow users to remove a movie from their list of favorites.
- Allow users to add a movie to their watchlist.
- Allow users to remove a movie to their watchlist.
- Allow existing users to deregister.

## Tools

- Javascript
- Node.js
- Express
- MongoDB
- Passport.js

## Get Started

- Clone the project ```https://github.com/aapartyka/movie_api```
- Install all dependencies mentioned in package.json
- cd to the project diretory
- Run it by: 
```bash 
$node index.js
```
if you you are using nodemon:

```bash 
$nodemon index.js
```

### Documentation

![movie_api_docu](https://user-images.githubusercontent.com/76936962/158821070-f66a8dee-4254-469e-8dd1-9e05081b5290.png)

You can view the full endpoint documentation of the api on:

(https://myflixandchill.herokuapp.com/documentation.html)

## Demo

The API is deployed to Heroku
### <a href="https://myflixandchill.herokuapp.com/">LIVE DEMO</a>

To test the endpoints I recommand using Postman, but every other tool like RapidAPI API Testing Paw, Apigee or Assertible etc. works fine.




