const { MongoClient } = require("mongodb");
require("dotenv").config();

//const url = "mongodb://localhost:27017";
const url = process.env.MONGODB_URL;
const client = new MongoClient(url);

module.exports = {
  db: null,

  users: null,
  tempUsers: null,
  urls: null,

  async connect() {
    await client.connect();
    this.db = client.db("UrlShortnerDb");
    this.users = this.db.collection("users");
    this.tempUsers = this.db.collection("tempUsers");
    this.urls = this.db.collection("urls");
  },
};
