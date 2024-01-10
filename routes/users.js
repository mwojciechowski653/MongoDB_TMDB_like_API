const express = require("express");
const recordRoutes = express.Router();
const ObjectId = require("mongodb").ObjectId;
const dbo = require("../db/conn")

recordRoutes.get("/Users", async function(req, res) {
    let result = await dbo.getDB().collection("Users").findOne({name:"Marcin"})
    res.send(result)
});

module.exports = recordRoutes;
