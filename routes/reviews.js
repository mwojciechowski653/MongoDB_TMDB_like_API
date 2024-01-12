const express = require("express");
const recordRoutes = express.Router();
const ObjectId = require("mongodb").ObjectId;
const dbo = require("../db/conn");

recordRoutes.get("/movies/:movieId/reviews", async function(req, res) {
    
    const movieId = req.params.movieId;

    let result = await dbo.getDB().collection("TMDB").aggregate([
        { $match: {_id: new ObjectId(movieId)}},
        { $project: {_id: 0, title: 1, reviews: 1}}
    ]).toArray();

    result.length === 0? res.status(404).send("Movie not find"): res.status(200).send(result);
});

recordRoutes.post("/movies/:movieId/reviews", async function(req, res) {
    
    const movieId = req.params.movieId;
})

module.exports = recordRoutes;