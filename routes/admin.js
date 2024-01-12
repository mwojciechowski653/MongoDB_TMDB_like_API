const express = require("express");
const recordRoutes = express.Router();
const ObjectId = require("mongodb").ObjectId;
const dbo = require("../db/conn");

recordRoutes.get("/admin/users", async function(req, res) {

    myQuery = {
        login: req.body.login,
        password: req.body.password,
        status: "Admin"
    }

    const dataCheck = await dbo.getDB().collection("Users").find(myQuery).toArray();

    if (dataCheck.length === 0){
        res.status(403).send("Access denied");
        return
    }

    const result = await dbo.getDB().collection("Users").find({}).toArray();

    res.status(200).send(result);
});

module.exports = recordRoutes;