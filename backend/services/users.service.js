const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../shared/mongo");
require("dotenv").config();
const mailer = require("../mailer");
const TinyURL = require("tinyurl");

//console.log(process.env.JWT_SECRET);

const service = {
  async register(req, res) {
    try {
      // Check Email exists
      const user = await db.users.findOne({ email: req.body.email });
      if (user) return res.status(400).send({ error: "User already exists" });

      //generating token for 15 minutes user can activate account within 15 mins
      const authToken = jwt.sign(
        { userName: req.body.name, email: req.body.email },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      //one time password to activate account
      const tempPassword = String(
        Math.floor(
          Math.random() * 7545 + Math.random() * 100 + Math.random() * 27 + 957
        )
      );

      // Generate Salt & Hash
      const salt = await bcrypt.genSalt();
      req.body.password = await bcrypt.hash(req.body.password, salt);

      //   Insert User
      await db.tempUsers.insertOne({ ...req.body, tempPassword });

      //send email to user
      //mailer(req.body.email, tempPass);

      res.send({
        message:
          "email sent please fill the password within 15 minutes to activate the user",
        //tempUser: { email: req.body.email, temppassword: tempPass },
        authToken,
      });
    } catch (err) {
      console.log("Error Registering User - ", err);
      res.sendStatus(500);
    }
  },

  async activate(req, res) {
    try {
      // Check if user with same email and tempPass exists
      const user = await db.tempUsers.findOne({
        email: req.user.email,
        tempPassword: req.body.tempPassword,
      });
      if (!user) {
        res.send({ err: "failed to find such user" });
      }

      const newUser = await db.users.insertOne({
        email: req.user.email,
        name: user.name,
        password: user.password,
      });
      res.send({ message: "User activation successfull" });

      //delete tempUser in tempUsers collection
      await db.tempUsers.deleteOne({
        email: req.user.email,
        tempPassword: req.body.tempPassword,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({ err: err });
    }
  },

  async login(req, res) {
    try {
      // Check Email exists
      const user = await db.users.findOne({ email: req.body.email });
      if (!user) return res.status(400).send({ error: "User doesn't exists" });

      // Check Password
      const isValid = await bcrypt.compare(req.body.password, user.password);

      if (!isValid)
        return res.status(403).send({ error: "Email or password is wrong" });

      // Generate Token
      const authToken = jwt.sign(
        { userName: user.name, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "3h" }
      );

      res.send({ authToken });
    } catch (err) {
      console.log("Error Login User - ", err);
      res.sendStatus(500);
    }
  },

  async forgotPass(req, res) {
    try {
      // Check Email exists
      const user = await db.users.findOne({ email: req.body.email });
      if (!user) return res.status(400).send({ error: "User doesn't exists" });

      // Generate Token
      const authToken = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      //create temp account/document for user with email and tempPassword in tempUsers collecion, storing password in the form of string
      const tempPass = String(
        Math.floor(
          Math.random() * 7545 + Math.random() * 100 + Math.random() * 27 + 957
        )
      );
      const tempUser = await db.tempUsers.insertOne({
        email: req.body.email,
        tempPassword: tempPass,
        // expiresIn: new Date().getTime() + 900 * 1000, //it will expire in 15 minutes, converted it into milliseconds
      });

      //send email to user
      // mailer(user.email, tempPass);

      res.send({
        message: "email sent please fill the password within 15 minutes",
        //tempUser: { email: req.body.email, temppassword: tempPass },
        authToken,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({ err: "falied sending email" });
    }
  },

  async resetPass(req, res) {
    //console.log(req.body);
    //we will get email and password from front end
    //check if email exist
    try {
      // Check if user with same email and tempPass exists
      const user = await db.tempUsers.findOne({
        email: req.body.email,
        tempPassword: req.body.tempPass,
      });
      if (!user) {
        res.send({ err: "failed to find such user" });
      }

      // Generate Salt & Hash
      const salt = await bcrypt.genSalt();
      req.body.newPassword = await bcrypt.hash(req.body.newPassword, salt);

      const updatedUser = await db.users.findOneAndUpdate(
        { email: req.user.email },
        {
          $set: { password: req.body.newPassword },
        }
      );
      res.send({ message: "password reset successfull" });

      //delete tempUser in tempUsers collection
      db.tempUsers.deleteOne({
        email: req.body.email,
        tempPassword: req.body.tempPass,
      });
    } catch (err) {
      console.log(err);
      res.status(500).send({ err: err });
    }
  },

  //private
  async getPrivate(req, res) {
    try {
      const urls = await db.urls.find({ email: req.user.email }).toArray();
      //console.log(urls);
      res.send(urls);
    } catch (err) {
      console.log(data);
      res.status(400).send({ err: "error fetching data" });
    }
  },

  async postPrivate(req, res) {
    try {
      const shortenedUrl = await TinyURL.shorten(req.body.url);

      const url = await db.urls.insertOne({
        email: req.user.email,
        url: req.body.url,
        shortenedUrl: shortenedUrl,
      });
      res.send({
        email: req.user.email,
        url: req.body.url,
        shortenedUrl: shortenedUrl,
      });
    } catch (err) {
      console.log(data);
      res.status(400).send({ err: "error fetching data" });
    }
  },
};

module.exports = service;
