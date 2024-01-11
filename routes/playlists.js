const express = require("express");
const recordRoutes = express.Router();
const ObjectId = require("mongodb").ObjectId;
const dbo = require("../db/conn");

recordRoutes.get("/playlists", async function(req, res) {

    const { login } = req.query;
    
    const result = await dbo.getDB().collection("Playlists").aggregate([
        { $match: {login: login}}
    ]).toArray();

    result.length === 0? res.status(404).send("You don't have any playlists!"): res.status(200).send(result);
});

recordRoutes.post("/playlists", async function(req, res) {

    const login = req.body.login;
    const name = req.body.name;
    const movies = req.body.movies;

    const searchedUser = await dbo.getDB().collection("Users").aggregate([
        { $match: {login: login}}
    ]).toArray();

    if (searchedUser.length === 0) {
        res.status(404).send("User not found");
        return
    };
    
    const searchPlaylist = await dbo.getDB().collection("Playlists").aggregate([
        { $match: {login: login, name: name}}
    ]).toArray();

    if (searchPlaylist.length != 0) {
        res.status(400).send("Playlist with this name already exists");
        return
    }; 


    const foundedMovies = await dbo.getDB().collection("TMDB").aggregate([
        { $match: {title: {$in: movies}}},
        { $project: {_id: 0, title: 1, genres: 1, plot: 1}}
    ]).toArray();

    if (foundedMovies.length === 0) {
        res.status(404).send("We don't have any movie from your message");
        return
    };

    const newPlaylist = {
        login: login,
        name: name,
        movies: foundedMovies
    }

    console.log(newPlaylist);

    dbo.getDB().collection("Playlists").insertOne(newPlaylist)
    .then(result => {
        res.status(200).send(result);
        return
    }).catch(err => res.status(421).send("Something went wrong"));
});



module.exports = recordRoutes;