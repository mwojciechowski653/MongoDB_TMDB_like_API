const express = require("express");
const recordRoutes = express.Router();
const ObjectId = require("mongodb").ObjectId;
const dbo = require("../db/conn");

recordRoutes.get("/tmdb", async function(req, res) {
    
    let result = await dbo.getDB().collection("TMDB").find({}).limit(20).toArray();

    res.status(200).send(result);
})

module.exports = recordRoutes;