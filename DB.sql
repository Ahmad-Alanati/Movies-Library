CREATE DATABASE lab13;

CREATE TABLE movies(
    id INT NOT NULL,
    title VARCHAR(255),
    release_Date DATE,
    poster_Path VARCHAR(500),
    overview VARCHAR(500),
    comment VARCHAR(500),
    PRIMARY KEY(id)
);