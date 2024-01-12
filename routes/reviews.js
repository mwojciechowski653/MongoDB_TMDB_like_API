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
    const myQuery = {_id: new ObjectId(movieId)};

    const myMovie = await dbo.getDB().collection("TMDB").aggregate([
        { $match: myQuery},
        { $project: {_id: 0, title: 1, reviews: 1}}
    ]).toArray();

    if (myMovie.length === 0) {
        res.status(404).send("Movie not find");
        return
    };

    let reviews = myMovie[0].reviews;
    let checker = 0

    console.log(reviews);

    await reviews.map(review => {
        if (review.nick == req.body.nick){
            res.status(400).send("Review with this nick already exists");
            checker = 1;
            return
        }
    });
    if (checker == 1){return};

    const myReview = {
        $addToSet: {
            reviews: {
                _id : new ObjectId(),
                nick: req.body.nick,
                rating: req.body.rating,
                review: req.body.review
            }
        }
    };

    dbo.getDB().collection("TMDB").updateOne(myQuery, myReview)
    .then(result => {res.status(200).send("Your review was succesfully added"); return})
    .catch(err => res.status(418).send(err))
    
})

module.exports = recordRoutes;