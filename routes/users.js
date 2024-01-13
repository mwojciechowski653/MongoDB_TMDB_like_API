const express = require("express");
const recordRoutes = express.Router();
const ObjectId = require("mongodb").ObjectId;
const dbo = require("../db/conn");

recordRoutes.get("/users", async function(req, res) {

    const result = await dbo.getDB().collection("Users").find({}).toArray();

    res.status(200).send(result);
});

recordRoutes.post("/users/register", async function(req, res) {

    const user = {
        login: req.body.login,
        password: req.body.password,
        sex: req.body.sex,
        mail: req.body.mail,
        phone: req.body.phone,
        birth: new Date(req.body.birth),
        stats: {
            views: 0,
            genres: {Drama: 0, Romance: 0, Comedy: 0, Musical: 0, War: 0, Adventure: 0, Crime: 0, Family: 0, Biography: 0, History: 0, Fantasy: 0, "Film-Noir": 0, Action: 0, Thriller: 0, Animation: 0, Horror: 0, Music: 0, Documentary: 0, Western: 0, Short: 0, Mystery: 0, Sport: 0, "Sci-Fi": 0},
            watchtime: 0
        }
    };
    const myQuery = {login: req.body.login};

    const result = await dbo.getDB().collection("Users").findOne(myQuery);
    if (result == undefined){
        await dbo.getDB().collection("Users").insertOne(user);
        res.status(200).send("You succesfully registered new acount!");
    }else {
        res.status(400).send("This login is already taken");
    }
});

recordRoutes.post("/users/login", async function(req, res) {

    const myQuery = {login: req.body.login, password: req.body.password};

    const result = await dbo.getDB().collection("Users").findOne(myQuery);

    if (result == undefined){
        res.status(400).send("Login or/and password are incorrect");
    }else {
        res.status(200).send("You succesfully signed to your account!");
    }
});

recordRoutes.get("/users/profile", async function(req, res) {
    
    const { login } = req.query;

    const myQuery = {login: login};
    const options = {
        projection: {_id: 0, sex: 0, birth: 0}
    };

    const result = await dbo.getDB().collection("Users").find(myQuery, options).toArray();

    result.length === 0? res.status(404).send("User not found"): res.status(200).send(result);
});

recordRoutes.put("/users/profile", async function(req, res) {
    
    const myQuery = {login: req.body.login};

    const profile = await dbo.getDB().collection("Users").findOne(myQuery);
    if (profile == undefined) {
        res.status(404).send("User not found");
        return
    };
    if (req.body.oldPassword != undefined && profile.password != req.body.oldPassword) {
        res.status(400).send("Wrong password");
        return
    };
    const password = req.body.newPassword == undefined? profile.password: req.body.newPassword;
    
    const newProfile = {
        "$set": {
            password: password,
            mail: req.body.mail || profile.mail,
            phone: req.body.phone || profile.phone
        }
    };
    console.log(newProfile);

    await dbo.getDB().collection("Users").updateOne(myQuery, newProfile);
    res.status(200).send("Your profile-info is succesfully updated");
});

recordRoutes.get("/users/:userId/stats", async function(req,res) {

    const userId = req.params.userId;

    const result = await dbo.getDB().collection("Users").aggregate([
        { $match: {_id: new ObjectId(userId)}},
        { $project: {_id: 0, stats: 1}}
    ]).toArray();

    result.length === 0? res.status(404).send("User not found"): res.status(200).send(result);
});

module.exports = recordRoutes;
