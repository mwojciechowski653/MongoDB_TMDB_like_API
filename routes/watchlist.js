const express = require("express");
const recordRoutes = express.Router();
const ObjectId = require("mongodb").ObjectId;
const dbo = require("../db/conn");

recordRoutes.get("/watchlist", async function(req, res) {

    const { login } = req.query;
    
    const result = await dbo.getDB().collection("Watchlist").aggregate([
        { $match: {login: login}},
        { $project: {_id: 0}}
    ]).toArray();

    result.length === 0? res.status(404).send("Watchlist for this user not found"): res.status(200).send(result);
});

recordRoutes.post("/watchlist", async function(req, res) {

    const login = req.body.login;
    const title = req.body.title;

    const searchedUser = await dbo.getDB().collection("Users").aggregate([
        { $match: {login: login}}
    ]).toArray();

    if (searchedUser.length === 0) {
        res.status(404).send("User not found");
        return
    }; 

    const searchedMovie = await dbo.getDB().collection("TMDB").aggregate([
        { $match: {title: title}},
        { $project: {_id: 0, title: 1}}
    ]).toArray();

    if (searchedMovie.length === 0) {
        res.status(404).send("Movie not found");
        return
    };

    const myQuery = {login: login};
    const myUpdate = {$addToSet: {wantToSee: title}};
    const options = {upsert: true};

    dbo.getDB().collection("Watchlist").updateOne(myQuery, myUpdate, options)
    .then(result => {
        res.status(200).send("New movie is in your watchlist!");
    }).catch(err => res.status(418).send("Something went wrong"));
});

recordRoutes.delete("/watchlist/:movieid", async function(req, res) {

    const login = req.body.login;
    const movieId = req.params.movieid;

    const searchedUser = await dbo.getDB().collection("Watchlist").aggregate([
        { $match: {login: login}}
    ]).toArray();

    if (searchedUser.length === 0) {
        res.status(404).send("User doesn't have a watchlist");
        return
    }; 

    const searchedMovie = await dbo.getDB().collection("TMDB").aggregate([
        { $match: {_id: new ObjectId(movieId)}},
        { $project: {_id: 0, title: 1}}
    ]).toArray();

    if (searchedMovie.length === 0) {
        res.status(404).send("Movie not found");
        return
    };

    const movieTitle = searchedMovie[0].title;
    const myQuery = {login: login};
    const myUpdate = {"$pull" : {wantToSee: movieTitle}};

    dbo.getDB().collection("Watchlist").updateOne(myQuery, myUpdate).then(result => {
        res.status(200).send(`\"${movieTitle}\" was deleted from your watchlist!`);
    }).catch(err => res.status(418).send("Something went wrong"));

});

module.exports = recordRoutes;