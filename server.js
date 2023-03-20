'use strict';
const express = require('express');
const movieData = require("./Movie Data/data.json");
const app = express();
const port = 3000;

function Movie(movieData){
  this.title = movieData["title"];
  this.posterPath = movieData["poster_path"];
  this.overview = movieData["overview"]
}

function ResponseError(str){
  this.code = str;
  this.response = str == "500"?"Sorry, something went wrong":"page not found error";
}

app.get('/', serverHandler);
app.get('/favorite', favoriteHandler);
app.get('*', notFoundHandler);
app.get('*', serverErrorHandler);

function notFoundHandler(req, res){
  let stat = new ResponseError("404");
  res.status(404).json(stat);
}

function serverErrorHandler(req, res){
  let stat = new ResponseError("500");
  res.status(500).json('stat');
}

function serverHandler(req,res){
  let movie = new Movie(movieData);
  res.json(movie);
}

function favoriteHandler(req,res){
  res.send("Welcome to Favorite Page");
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})