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
        res.status(404).send("We don't have any movie from your request");
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

recordRoutes.put("/playlists/:playlistsId", async function(req, res) {

    const playlistsId = req.params.playlistsId;
    const movies = req.body.movies;
    const title = req.body.title;
    const myQuery = {_id: new ObjectId(playlistsId)};

    const foundedPlaylist = await dbo.getDB().collection("Playlists").aggregate([
        { $match: myQuery}
    ]).toArray();

    if (foundedPlaylist.length === 0) {
        res.status(404).send("Playlist not found");
        return
    };

    console.log(foundedPlaylist);

    switch (req.body.type) {
        case "add":
            const foundedMovies = await dbo.getDB().collection("TMDB").aggregate([
                { $match: {title: {$in: movies}}},
                { $project: {_id: 0, title: 1, genres: 1, plot: 1}}
            ]).toArray();

            if (foundedMovies.length === 0) {
                res.status(404).send("We don't have any movie from your request");
                return
            };
        
            const myUpdate = {
                $addToSet: {
                    movies: {
                        $each: foundedMovies
                    }
                } 
            };
        
            console.log(myUpdate);
        
            dbo.getDB().collection("Playlists").updateOne(myQuery, myUpdate)
            .then(result => {
                res.status(200).send(result);
                return
            }).catch(err => {res.status(421).send("Something went wrong");return});
            break;

        case "delete":
            const foundedMovies2 = await dbo.getDB().collection("Playlists").aggregate([
                { $match: myQuery},
                { $project: {_id: 0, movies: 1}}
            ]).toArray();

            const moviesToDelete = foundedMovies2[0].movies.reduce((acc,movie) => {
                if (movies.includes(movie.title)){
                    return [...acc, movie]
                }
                return [...acc]
            }, [])
            console.log(moviesToDelete);

            if (moviesToDelete.length === 0) {
                res.status(404).send("None of this movies is in your playlist");
                return
            };
        
            const myUpdate2 = {
                $pull: {
                    movies: {
                        $in: moviesToDelete
                    }
                } 
            };
        
            console.log(myUpdate2);
        
            dbo.getDB().collection("Playlists").updateOne(myQuery, myUpdate2)
            .then(result => {
                res.status(200).send(result);
                return
            }).catch(err => {res.status(421).send("Something went wrong");return});
            break;

        case "order":
            const foundedMovies3 = await dbo.getDB().collection("Playlists").aggregate([
                { $match: myQuery},
                { $project: {_id: 0, movies: 1}}
            ]).toArray();

            const myMovie = foundedMovies3[0].movies.reduce((acc,movie) => {
                if (movie.title == title){
                    return movie
                }
                return acc
            }, "")
            console.log(myMovie);

            if (myMovie === "") {
                res.status(404).send("You don't have this movie in your playlist");
                return
            };

            const myDelete = {
                $pull: {
                    movies: myMovie
                }
            };
        
            await dbo.getDB().collection("Playlists").updateOne(myQuery, myDelete);

            const myUpdate3 = {
                $push: {
                    movies: {
                        $each: [myMovie],
                        $position: req.body.order-1
                    }
                } 
            };
        
            console.log(myUpdate3);
        
            dbo.getDB().collection("Playlists").updateOne(myQuery, myUpdate3)
            .then(result => {
                res.status(200).send(result);
                return
            }).catch(err => {res.status(421).send("Something went wrong");return});
            break;

        default:
            res.status(412).send("Wrong type of the order");
            return
    };
})

recordRoutes.delete("/playlists/:playlistsId", async function(req, res) {

    const playlistsId = req.params.playlistsId;

    const foundedPlaylist = await dbo.getDB().collection("Playlists").aggregate([
        { $match: {_id: new ObjectId(playlistsId)}},
        { $project: {name: 1}}
    ]).toArray();

    if (foundedPlaylist.length === 0) {
        res.status(404).send("Playlist not found");
        return
    };

    console.log(foundedPlaylist);

    const myQuery = {_id: new ObjectId(playlistsId)};
    const myPlaylistsName = foundedPlaylist[0].name;

    dbo.getDB().collection("Playlists").deleteOne(myQuery).then(result => {
        res.status(200).send(`\"${myPlaylistsName}\" was deleted!`);
        return
    }).catch(err => res.status(418).send("Something went wrong"));

})

module.exports = recordRoutes;