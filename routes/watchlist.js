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
        { $project: {_id: 0, title: 1, genres: 1, plot: 1}}
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
        return
    }).catch(err => res.status(418).send("Something went wrong"));
});



module.exports = recordRoutes;