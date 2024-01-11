const {MongoClient} = require("mongodb");
require("dotenv").config({path: "./config.env"});
const Db = process.env.MONGO_URI;
const client = new MongoClient(Db);

var _db;


async function connectToServer(callback) {
  try {
    _db = client.db("mongo_database");
    console.log("Connected to MongoDB database")
  } catch(err) {
    callback(err)
  }
}
function getDB(){
    return _db
}

module.exports={connectToServer, getDB}