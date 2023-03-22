'use strict';
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const movieData = require("./Movie Data/data.json");
const app = express();
app.use(cors());
const port = process.env.PORT;
const APIKey = process.env.API_KEY

function Movie(movieData) {
  this.id = movieData["id"];
  this.title = movieData["title"] == null ? movieData["name"] : movieData["title"];
  this.release_Date = movieData["release_date"] == null ? movieData["first_air_date"] : movieData["release_date"];
  this.poster_Path = movieData["poster_path"];
  this.overview = movieData["overview"];
}

function ResponseError(obj) {
  this.status = obj.statusCode;
  this.responseText = this.status == "500" ? "Sorry, something went wrong" : "page not found error";
}

app.get('/', serverHandler);
app.get('/favorite', favoriteHandler);
app.get('/trending', trendingHandler);
app.get('/search', searchHandler);
app.get('/changes', changesHandler);
app.get('/discover', discoverHandler);
app.use('*', notFoundHandler);

function notFoundHandler(req, res) {
  let stat = new ResponseError(res.status(404));
  res.send(stat);
}
function serverHandler(req, res) {
  let movie = new Movie(movieData);
  res.json(movie);
}

function favoriteHandler(req, res) {
  res.send("Welcome to Favorite Page");
}

function trendingHandler(req, res) {
  let movieType = req.query.movie_Type == null ? "all" : req.query.movie_Type;
  let movieTime = req.query.movie_Time == null ? "week" : req.query.movie_Time;
  let url = `https://api.themoviedb.org/3/trending/${movieType}/${movieTime}?api_key=${APIKey}`;
  //example : http://localhost:3000/trending?movie_Type=all&movie_Time=week
  axios.get(url)
    .then(resAPI => {
      let arrOfTrending = resAPI.data.results.map(element => {
        return new Movie(element);
      });
      res.json(arrOfTrending);
    })
    .catch(error => {
      res.send(error);
    })
}

function searchHandler(req, res) {
  let movieName = req.query.movie_Name;
  let url = `https://api.themoviedb.org/3/search/movie?query=${movieName}&api_key=${APIKey}`;
  axios.get(url)
    .then(resAPI => {
      let arrOfMovies = resAPI.data.results.map(element => {
        return new Movie(element);
      });
      res.json(arrOfMovies);
    })
    .catch(error => {
      res.send(error);
    })
}

function changesHandler(req, res) {
  let url = `https://api.themoviedb.org/3/movie/changes?api_key=${APIKey}`;
  axios.get(url)
    .then(resAPI => {
      let arrOfGenres = resAPI.data.results.map(element => {
        return new Movie(element);
      });
      res.json(arrOfGenres);
    })
    .catch(error => {
      res.send(error);
    })
}

function discoverHandler (req,res){
  let url = `https://api.themoviedb.org/3/discover/movie?api_key=${APIKey}`;
  axios.get(url)
    .then(resAPI => {
      let arrOfMovies = resAPI.data.results.map(element => {
        return new Movie(element);
      });
      res.json(arrOfMovies);
    })
    .catch(error => {
      res.send(error);
    })
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})