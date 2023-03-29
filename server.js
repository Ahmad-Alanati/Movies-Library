'use strict';
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const movieData = require("./Movie Data/data.json");
const {Client} = require('pg');

const client = new Client(process.env.dburl);

const app = express();
app.use(cors());
const port = process.env.PORT;
const APIKey = process.env.API_KEY

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

function Movie(movieData) {
  this.id = movieData["id"];
  this.title = movieData["title"] == null ? movieData["name"] : movieData["title"];
  this.release_date = movieData["release_date"] == null ? movieData["first_air_date"] : movieData["release_date"];
  this.poster_path = movieData["poster_path"] != null? movieData["poster_path"]:null;
  this.overview = movieData["overview"] != null? movieData["overview"]:null;
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
app.get('/getMovies',getMoviesHandler)
app.get('/getMovie/:id',getMovieHandler)
app.post('/addMovie',addMovieHandler)
app.put('/UPDATE/:id',updateMovieHandler)
app.delete('/DELETE/:id',deleteMovieHandler)
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
    });
}

function addMovieHandler(req,res){
  let movieObj = new Movie(req.body);
  let sql = `INSERT INTO movies (id, title, release_date, poster_path, overview,comment) VALUES($1,$2,$3,$4,$5,$6);`;
  let values = [movieObj.id,movieObj.title,movieObj.release_date,movieObj.poster_path,movieObj.overview,req.body.comment];
  client.query(sql,values).then(
    res.status(201).send("data has been saved successfully")
  ).catch(error =>{
    console.log(error);
  });
  
}

function getMoviesHandler(req,res){
  let sql = `SELECT * FROM movies;`;
  client.query(sql).then(result =>{
    res.send(result.rows);
  }
  ).catch(error =>{
    console.log(error);
  });
}

function updateMovieHandler(req,res){
  let id =parseInt(req.params.id);
  let comment = req.body.comment;
  let sql = `UPDATE movies SET comment = $1 WHERE  id = $2;`;
  let values= [comment,id];
  client.query(sql,values).then(
    res.send(`the data in ${id} movie has been updated`)
  ).catch(error =>{
    console.log(error);
  });
}

function deleteMovieHandler(req,res){
  let id =parseInt(req.params.id);
  let sql = `DELETE FROM movies WHERE id=$1;`;
  let values =[id]
  client.query(sql,values).then(
    res.status(204).send(`the data in ${id} movie has been deleted`)
  ).catch(error =>{
    console.log(error);
  });
}

function getMovieHandler(req,res){
  let id =parseInt(req.params.id);
  let sql = `SELECT * FROM movies WHERE id=$1;`;
  let values =[id]
  client.query(sql,values).then(result =>{
    res.send(result.rows);
  }
  ).catch(error =>{
    console.log(error);
  });
}

client.connect().then(()=>{
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
  })
}).catch()
