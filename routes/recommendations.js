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
    };

    console.log(profile.stats.genres);

    dbo.getDB().collection("Users").updateOne(myQuery, {$set: profile})
    .then(result => {
        res.status(200).send(`You watched ${movieTitle}`);
    })
    .catch(err => res.status(421).send("Something went wrong"));
});

recordRoutes.get("/recommendations", async(req, res) => {

    const { login } = req.query;
    const myQuery = {login: login};

    const prof = await dbo.getDB().collection("Users").find(myQuery).toArray();

    if (prof.length === 0) {
        res.status(404).send("User not found");
        return
    };

    const genres = await dbo.getDB().collection("Users").aggregate([
        { $match: myQuery},
        { $project: {_id: 0, "stats.genres": 1}}
    ]).toArray();

    const sortedGenres = Object.entries(genres[0].stats.genres)
    .sort(([,a],[,b]) => b-a);
    const favNumber = sortedGenres[0][1];
    // .reduce((r, [k, v]) => ({ ...r, [k]: v }), {});

    if (favNumber === 0){
        let result = await dbo.getDB().collection("TMDB").aggregate([
            { $sample: {size: 5}},
            { $project: { _id:0, title:1, languages:1, genres:1, plot:1, 
                popularity: {$round: [{$multiply: [ {$toDouble: "$imdb.rating"}, {$toInt: "$imdb.votes"} ]}, 0]} }}
            ]).toArray();
        res.status(200).send(result);
        return
    }; 

    const favGenres = sortedGenres.reduce((acc, curr) => {
        if (curr[1]==favNumber) {
            return [...acc, curr[0]]
        } 
        return [...acc]
    }, []);

    console.log(favGenres);

    let result = await dbo.getDB().collection("TMDB").aggregate([
        { $match: {genres: {$all: favGenres}}},
        { $sample: {size: 5}},
        { $project: { _id:0, title:1, languages:1, genres:1, plot:1, 
            popularity: {$round: [{$multiply: [ {$toDouble: "$imdb.rating"}, {$toInt: "$imdb.votes"} ]}, 0]} }}
        ]).toArray();

    if (result.length != 0) {
        res.status(200).send(result)
        return
    };
    
    let result2 = await dbo.getDB().collection("TMDB").aggregate([
        { $match: {genres: favGenres[0]}},
        { $sample: {size: 5}},
        { $project: { _id:0, title:1, languages:1, genres:1, plot:1, 
            popularity: {$round: [{$multiply: [ {$toDouble: "$imdb.rating"}, {$toInt: "$imdb.votes"} ]}, 0]} }}
        ]).toArray();

    res.status(200).send(result2)
});

module.exports = recordRoutes;