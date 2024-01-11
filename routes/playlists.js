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



module.exports = recordRoutes;