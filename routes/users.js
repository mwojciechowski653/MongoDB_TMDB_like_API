const express = require("express");
const recordRoutes = express.Router();
const ObjectId = require("mongodb").ObjectId;
const dbo = require("../db/conn")

recordRoutes.get("/users", async function(req, res) {
    
    let result = await dbo.getDB().collection("Users").find({}).toArray();

    res.status(200).send(result);
})

recordRoutes.post("/users/register", async function(req, res) {

    const user = {
        login: req.body.login,
        password: req.body.password,
        sex: req.body.sex,
        mail: req.body.mail,
        phone: req.body.phone,
        birth: new Date(req.params.birth)
    };
    const myQuery = {login: req.body.login};

    let result = await dbo.getDB().collection("Users").findOne(myQuery);
    if (result == undefined){
        await dbo.getDB().collection("Users").insertOne(user);
        res.status(200).send("You succesfully registered new acount!");
    }else {
        res.status(400).send("This login is already taken");
    }
});

recordRoutes.post("/users/login", async function(req, res) {

    const myQuery = {login: req.body.login, password: req.body.password};

    let result = await dbo.getDB().collection("Users").findOne(myQuery);

    if (result == undefined){
        res.status(400).send("Login or/and password are incorrect")
    }else {
        res.status(200).send("You succesfully signed to your account!");
    }
});

module.exports = recordRoutes;
