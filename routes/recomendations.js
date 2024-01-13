const express = require("express");
const recordRoutes = express.Router();
const ObjectId = require("mongodb").ObjectId;
const dbo = require("../db/conn");

recordRoutes.post("/movie/watched", async(req,res)=>{

    const movieTitle = req.body.title;
    const myQuery = {login: req.body.login};

    const prof = await dbo.getDB().collection("Users").find(myQuery).toArray();
    let profile = prof[0];

    if (prof.length === 0) {
        res.status(404).send("User not found");
        return
    };

    const searchedMovie = await dbo.getDB().collection("TMDB").aggregate([
        { $match: {title: movieTitle}}
    ]).toArray();

    if (searchedMovie.length === 0) {
        res.status(404).send("Movie not found");
        return
    };

    Object.keys(profile.stats.genres).forEach(function(key, index) {
        if (searchedMovie[0].genres.includes(key)){
            profile.stats.genres[key] += 1;
        }
      });

    profile.stats = {
        views: profile.stats.views+1,
        genres: profile.stats.genres,
        watchtime: profile.stats.watchtime+searchedMovie[0].runtime
    }

    console.log(profile.stats.genres)

    dbo.getDB().collection("Users").updateOne(myQuery, {$set: profile})
    .then(result => {
        res.status(200).send(`You watched ${movieTitle}`);
    })
    .catch(err => res.status(421).send("Something went wrong"));
});

module.exports = recordRoutes;