CREATE DATABASE lab13;

CREATE TABLE movies(
    movieID INT NOT NULL,
    title VARCHAR(255),
    releaseDate DATE,
    posterPath VARCHAR(500),
    overview VARCHAR(500),
    personalComments VARCHAR(500),
    PRIMARY KEY(movieID)
);