const express = require("express");
const recordRoutes = express.Router();
const ObjectId = require("mongodb").ObjectId;
const dbo = require("../db/conn");

recordRoutes.get("/tmdb", async function(req, res) {
    
    let result = await dbo.getDB().collection("TMDB").find({}).limit(5).toArray();

    res.status(200).send(result);
})

recordRoutes.get("/tmdb/movies/popular", async function(req, res) {
    
    let result = await dbo.getDB().collection("TMDB").aggregate([
        { $project: { _id:0, title:1, languages:1, genres:1, plot:1, 
            popularity: {$round: [{$multiply: [ {$toDouble: "$imdb.rating"}, {$toInt: "$imdb.votes"} ]}, 0]} }},
        { $sort: {popularity: -1}},
        { $limit: 5}
        ]).toArray();

    res.status(200).send(result);
})

module.exports = recordRoutes;