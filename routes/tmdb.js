const express = require("express");
const recordRoutes = express.Router();
const ObjectId = require("mongodb").ObjectId;
const dbo = require("../db/conn");

recordRoutes.get("/tmdb", async function(req, res) {
    
    let result = await dbo.getDB().collection("TMDB").find({}).limit(5).toArray();

    res.status(200).send(result);
});

recordRoutes.get("/tmdb/movies/popular", async function(req, res) {
    
    let result = await dbo.getDB().collection("TMDB").aggregate([
        { $project: { _id:0, title:1, languages:1, genres:1, plot:1, 
            popularity: {$round: [{$multiply: [ {$toDouble: "$imdb.rating"}, {$toInt: "$imdb.votes"} ]}, 0]} }},
        { $sort: {popularity: -1}},
        { $limit: 5}
        ]).then(result2 => {return result2.toArray()}).catch(err => res.send(err));
    res.status(200).send(result);
});

recordRoutes.get("/tmdb/movies/search", async function(req, res) { 

    const searchData = {
        title: req.body.title || "NG",
        genres: req.body.genres || ["NG"],
        year: req.body.year || "NG",
        cast: req.body.cast || ["NG"],
        runtime: req.body.runtime || "NG",
        directors: req.body.directors || ["NG"]
    };

    console.log(searchData);

    // title -> cast -> directors -> genres -> year -> runtime

    let result2 = [] 
    let res1 = await dbo.getDB().collection("TMDB").aggregate([{ $match: {title: searchData.title}},{ $project: {genres: 1, title: 1, year: 1, cast: 1, runtime: 1, directors: 1}},{ $limit: 10}]).toArray();
    result2.push(res1)
    let res2 = await dbo.getDB().collection("TMDB").aggregate([{ $match: {cast: {$all: searchData.cast}}},{ $project: {genres: 1, title: 1, year: 1, cast: 1, runtime: 1, directors: 1}},{ $limit: 10}]).toArray();
    result2.push(res2)
    let res3 = await dbo.getDB().collection("TMDB").aggregate([{ $match: {directors: {$all: searchData.directors}}},{ $project: {genres: 1, title: 1, year: 1, cast: 1, runtime: 1, directors: 1}},{ $limit: 10}]).toArray();
    result2.push(res3)
    let res4 = await dbo.getDB().collection("TMDB").aggregate([{ $match: {genres: {$all: searchData.genres}}},{ $project: {genres: 1, title: 1, year: 1, cast: 1, runtime: 1, directors: 1}},{ $limit: 10}]).toArray();
    result2.push(res4)
    let res5 = await dbo.getDB().collection("TMDB").aggregate([{ $match: {year: searchData.year}},{ $project: {genres: 1, title: 1, year: 1, cast: 1, runtime: 1, directors: 1}},{ $limit: 10}]).toArray();
    result2.push(res5)
    let res6 = await dbo.getDB().collection("TMDB").aggregate([{ $match: {runtime: searchData.runtime}},{ $project: {genres: 1, title: 1, year: 1, cast: 1, runtime: 1, directors: 1}},{ $limit: 10}]).toArray();
    result2.push(res6)

    // let result = [];
    // searchData.forEach(async(obj)=>{
    //     if(Object.values(obj)[0] != "NG"){
    //         let key = Object.keys(obj)[0];
    //         let value = Object.values(obj)[0];
    //         let res = await dbo.getDB().collection("TMDB").aggregate([
    //             { $match: {title: {$all: ["Three Ages"].flat()}}},
    //             { $project: {genres: 1, title: 1, year: 1, cast: 1, runtime: 1, directors: 1}}
    //         ]).toArray();
    //         result.push(res);
    //     }
    // })
    // console.log(result);

    // let result = await Object.keys(searchData).reduce(async (acc, key) => {
    //     console.log(key,":",searchData[key]);
    //     console.log(acc);

    //     if (searchData[key] != "NG"){
    //         if(key == "genres" || key == "cast" || key == "directors"){
    //             let res = await dbo.getDB().collection("TMDB").aggregate([
    //                 { $match: {key: {$all: [searchData[key]].flat()}}},
    //                 { $project: {genres: 1, title: 1, year: 1, cast: 1, runtime: 1, directors: 1}}
    //             ]).toArray();
    //             return [acc, Array.from(res)]
    //         }
    //         let res = await dbo.getDB().collection("TMDB").aggregate([
    //             { $match: {key: searchData[key]}},
    //             { $project: {genres: 1, title: 1, year: 1, cast: 1, runtime: 1, directors: 1}}
    //         ]).toArray();
    //         return [acc, Array.from(res)]
    //     }
    //     return [acc]
    // }, []);
    // console.log(result)

    let finalResult = result2.flat().slice(0,10);
    finalResult.length === 0? res.status(404).send("Nothing suits your search-data"): res.status(200).send(finalResult);

    // let result = await dbo.getDB().collection("TMDB").aggregate([
    //     { $match: { $or: [{title: searchData.title}, {genres: {$all: [searchData.genres]}}, {year: searchData.year}, {cast: {$all: [searchData.cast]}}, {runtime: searchData.runtime}, {directors: {$all: [searchData.directors]}} ] }},
    //     { $project: {genres: 1, title: 1, year: 1, cast: 1, runtime: 1, directors: 1}},
    //     { $limit: 10}
    //     ]).toArray();

    // result.length === 0? res.status(404).send("Nothing suits your search-data"): res.status(200).send(result);

});

recordRoutes.get("/tmdb/movies/genres", async function(req, res) {
    
    let result = await dbo.getDB().collection("TMDB").aggregate([
        { $project: { _id:0, genres:1}},
        { $unwind: "$genres"},
        { $group: {
            _id: "$genres",
            count: { $sum: 1 }
        }},
        { $sort: { count: -1}}
        ]).toArray();

    res.status(200).send(result);
});

recordRoutes.get("/tmdb/movies/:id", async function(req, res) {
    
    const id = req.params.id;

    let result = await dbo.getDB().collection("TMDB").aggregate([
        { $match: { _id: new ObjectId(id)}}
        ]).toArray();

    result.length === 0? res.status(404).send("Movie not found"): res.status(200).send(result);
});

module.exports = recordRoutes;