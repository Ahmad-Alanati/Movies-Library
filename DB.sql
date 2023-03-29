CREATE DATABASE lab13;

CREATE TABLE movies(
    id INT NOT NULL,
    title VARCHAR(255),
    release_date DATE,
    poster_path VARCHAR(500),
    overview VARCHAR(500),
    comment VARCHAR(500),
    PRIMARY KEY(id)
);