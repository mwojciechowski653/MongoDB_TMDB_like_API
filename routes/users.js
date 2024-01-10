const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../db/conn");

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
        birth: new Date(req.body.birth)
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
        res.status(400).send("Login or/and password are incorrect");
    }else {
        res.status(200).send("You succesfully signed to your account!");
    }
});

recordRoutes.get("/users/profile", async function(req, res) {
    
    const myQuery = {login: req.body.login};
    const options = {
        projection: {_id: 0, sex: 0, birth: 0}
    };

    let result = await dbo.getDB().collection("Users").find(myQuery, options).toArray();

    result.length === 0? res.status(404).send("User not found"): res.status(200).send(result);
})

recordRoutes.put("/users/profile", async function(req, res) {
    
    const myQuery = {login: req.body.login};

    let profile = await dbo.getDB().collection("Users").findOne(myQuery);
    if (profile == undefined){
        res.status(404).send("User not found")
        return
    }

    const newProfile = {
        "$set": {
            password: req.body.password || profile.password,
            mail: req.body.mail || profile.mail,
            phone: req.body.phone || profile.phone
        }
    };
    console.log(newProfile);

    await dbo.getDB().collection("Users").updateOne(myQuery, newProfile)
    res.status(200).send("Your profile-info is succesfully updated");
})

module.exports = recordRoutes;
