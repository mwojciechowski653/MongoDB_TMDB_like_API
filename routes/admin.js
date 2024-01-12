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

    const myUpdate = {
        $set: {status: req.body.newStatus}
    };

    dbo.getDB().collection("Users").updateOne(myQuery2, myUpdate)
    .then(result => {
        res.status(200).send("Status of this user has changed");
    })
    .catch(err => res.status(418).send(err));
});

module.exports = recordRoutes;