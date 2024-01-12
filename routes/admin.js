const express = require("express");
const recordRoutes = express.Router();
const ObjectId = require("mongodb").ObjectId;
const dbo = require("../db/conn");

recordRoutes.get("/admin/users", async function(req, res) {

    myQuery = {
        login: req.body.login,
        password: req.body.password,
        status: "Admin"
    };

    const dataCheck = await dbo.getDB().collection("Users").find(myQuery).toArray();

    if (dataCheck.length === 0){
        res.status(403).send("Access denied");
        return
    };

    const result = await dbo.getDB().collection("Users").find({}).toArray();

    res.status(200).send(result);
});

recordRoutes.put("/admin/users/:userId", async function(req, res) {

    const userId = req.params.userId;

    const myQuery = {
        login: req.body.login,
        password: req.body.password,
        status: "Admin"
    };

    const dataCheck = await dbo.getDB().collection("Users").find(myQuery).toArray();

    if (dataCheck.length === 0){
        res.status(403).send("Access denied");
        return
    };

    const myQuery2 = {
        _id: new ObjectId(userId)
    };

    const dataCheckVol2 = await dbo.getDB().collection("Users").find(myQuery2).toArray();

    if (dataCheckVol2.length === 0){
        res.status(404).send("User not found");
        return
    };  

    if (dataCheckVol2[0].login == req.body.login){
        res.status(403).send("You can't change your own status");
        return
    };

    const myUpdate = {
        $set: {status: req.body.newStatus}
    };

    dbo.getDB().collection("Users").updateOne(myQuery2, myUpdate)
    .then(result => {
        res.status(200).send("Status of this user has changed");
    })
    .catch(err => res.status(418).send(err));
});

recordRoutes.post("/admin/movies", async function(req, res) {

    const myQuery = {
        login: req.body.login,
        password: req.body.password,
        status: "Admin"
    };

    const dataCheck = await dbo.getDB().collection("Users").find(myQuery).toArray();

    if (dataCheck.length === 0){
        res.status(403).send("Access denied");
        return
    };

    const myQuery2 = {
        title: req.body.title
    };

    const dataCheckVol2 = await dbo.getDB().collection("TMDB").find(myQuery2).toArray();

    if (dataCheckVol2.length != 0){
        res.status(409).send("Movie with this title already exists");
        return
    };  

    const myInsert = {
        plot: req.body.plot,
        genres: req.body.genres,
        runtime: req.body.runtime,
        rated: req.body.rated,
        cast: req.body.cast,
        poster: req.body.poster,
        title: req.body.title,
        fullplot: req.body.fullplot,
        languages: req.body.languages,
        released: new Date(req.body.released),
        directors: req.body.directors,
        writers: req.body.writers,
        awards: req.body.awards,
        lastupdated: new Date(),
        year: req.body.year,
        imdb: req.body.imdb,
        countries: req.body.countries,
        type: req.body.type,
        tomatoes: req.body.tomatoes,
        reviews: req.body.reviews
    };

    console.log(myInsert);

    dbo.getDB().collection("TMDB").insertOne(myInsert)
    .then(result => {
        res.status(200).send(`\"${req.body.title}\" was added to the database!`);
    })
    .catch(err => res.status(418).send(err));
});

recordRoutes.put("/admin/movies/:movieId", async function(req, res) {

    const movieId = req.params.movieId;

    const myQuery = {
        login: req.body.login,
        password: req.body.password,
        status: "Admin"
    };

    const dataCheck = await dbo.getDB().collection("Users").find(myQuery).toArray();

    if (dataCheck.length === 0){
        res.status(403).send("Access denied");
        return
    };

    const myQuery2 = {
        _id: new ObjectId(movieId) 
    };

    const dataCheckVol2 = await dbo.getDB().collection("TMDB").find(myQuery2).toArray();

    if (dataCheckVol2.length == 0){
        res.status(404).send("Movie not found");
        return
    };  

    console.log(dataCheckVol2)

    const currentMovie = dataCheckVol2[0];
    const myUpdate = {
        $set: {
            plot: req.body.plot || currentMovie.plot,
            rated: req.body.rated || currentMovie.rated,
            cast: req.body.cast || currentMovie.cast,
            poster: req.body.poster || currentMovie.poster,
            fullplot: req.body.fullplot || currentMovie.plot,
            languages: req.body.languages || currentMovie.languages,
            awards: req.body.awards || currentMovie.awards,
            lastupdated: new Date(),
            imdb: req.body.imdb || currentMovie.imdb,
            tomatoes: req.body.tomatoes || currentMovie.tomatoes,
            reviews: req.body.reviews || currentMovie.reviews
        }
    };

    console.log(myUpdate);

    dbo.getDB().collection("TMDB").updateOne(myQuery2, myUpdate)
    .then(result => {
        res.status(200).send(`\"${currentMovie.title}\" was updated!`);
    })
    .catch(err => res.status(418).send(err));
});

module.exports = recordRoutes;