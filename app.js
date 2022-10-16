import express from 'express';
import { v4 as uuid } from 'uuid';
import movies from './movies.json' assert { type: "json" };

const app = express();

app.use(express.json())
app.use(express.urlencoded({ extended: false }));


app.get('/movies', (req, res) => res.json(movies));                         // Get all movies
app.post('/movies', function (req, res) { createMovie(req, res); })         // Create a new movie
app.get('/movies/:id', function (req, res) { readMovie(req, res); })        // Read a movie
app.put('/movies/:id', function (req, res) { updateMovie(req, res); })      // Update a movie
app.delete('/movies/:id', function (req, res) { deleteMovie(req, res); })   // Delete a movie


function isInvalid(req, res) {
    switch (undefined) {
        case (req.body.title):
            res.status(400).send(`Invalid request. Title is missing.`);
            return true;
        case (req.body.director):
            res.status(400).send('Invalid request. Director missing!');
            return true;
        case (req.body.release_date):
            res.status(400).send('Invalid request. No release date given');
            return true;
        default:
            return false;
    }
}

function createMovie(req, res) {
    if (isInvalid(req, res)) {
        return;
    }
    const id = uuid();
    const movie = {
        id: id,
        title: req.body.title,
        director: req.body.director,
        release_date: req.body.release_date
    }
    if (movies.some(movie => movie.title === req.body.title)) {
        res.status(403).send(`Movie with the title "${movie.title}" already exists in the list.`);
    } else {
        movies.push(movie);
        res.setHeader('Content-Type', 'application/json');
        res.status(201).json({
            Msg: `Movie is added to the list with the id ${id}!`,
        movies});
    }
}

function readMovie(req, res){
    const id = req.params.id;
    for (let movie of movies) {
        if (movie.id === id) {
            res.status(200);
            res.json(movie);
            return;
        }
    }
    res.status(404).send('movie not found')
}

function updateMovie(req, res){
    const movieToUpdate = movies.find(movie => movie.id === req.params.id);
    if (typeof movieToUpdate === 'undefined') {
        res.status(404);
        res.send('No such movie');
        return;
    }
    movieToUpdate.id = req.params.id;
    movieToUpdate.title = req.body.title || movieToUpdate.title;
    movieToUpdate.director = req.body.director || movieToUpdate.director;
    movieToUpdate.release_date = req.body.release_date || movieToUpdate.release_date;
    res.setHeader('Content-Type', 'application/json');
    res.status(201).json({Msg: "Movie updated", movies});
}

function deleteMovie(req, res){
    const movieToDelete = movies.find(movie => movie.id === req.params.id);
    if (typeof movieToDelete === 'undefined') {
        res.status(404).send(`No movie found with the id ${req.params.id}`);
        return;
    }
    movies.splice(movies.indexOf(movieToDelete), 1);
    res.status(202).json({Msg: 'Movie is deleted', movies})
}

export default app;
