const express = require("express");
const userModel = require('../models/user');
var moment = require("moment");
const bodyParser = require('body-parser');
const log = require("../utils/serverLog");
const router = express.Router();
router.use(bodyParser.json());

/**
 * user/login
 * Login user (if he exists in the database)
 */
router.post("/login", (req, res) => {
  log.note("POST /login request recieved");
  // pass email empty?
  if(req.body.email === "" || req.body.password === ""){
    res.sendStatus(403);
    log.subError("Email or password Empty, Response: 403");
  } else {
    // user found?
    userModel.findOne({email: req.body.email}, (error, result) => {
      if(error) {
        res.status(403).send("Something went wrong");
        log.subError("Database error recieved");
        log.stackTrace(error);
      } else if (result) {
        if(result.password == req.body.password){
          log.subSuccess("User found in database");
          log.subSuccess("Passwords match!")
          // update status
          userModel.findOneAndUpdate({email: result.email}, {loggedin: true}, (error, res)=>{
            if (error) {
              log.subError("Update login status failed");
            } else if(res) {
              log.subSuccess(res.email + " loggedin status updated to " + res.loggedin);
            }
          });

          // send response
          res.json({
            "_id":result._id,
            "email": result.email,
            "name":result.name
          });
        }
      }
      // a catch all
      if(!res.headersSent){
        log.subError("Headers not sent. Response: 403 wrong credentials.")
        res.status(403).send("WRONG CREDENTIALS");
      }
    });
  }
});

// GOT TO HERE!!

/**
 * user/logout
 * Log user out of the account
 */
router.post("/logout", (req, res) => {
  var user = {}
  user._id = req.body._id;

  userModel.findOneAndUpdate({_id: user._id},{loggedin: false}, (err, result) => {
    if(err) {
      console.error(err);
      res.status(403).send();
    }
    else{
      console.log("Server: /user/logout: " + result.name + " logged out");
      res.status(200).send();
    }
  });
});


/**
 * user/create
 * check if user with this email exist, if not then create new one
 */
router.post("/create", (req, res) => {

  userModel.findOne({email: req.body.email}, (err, result) => {
    if(err){
      console.error(err);
    }
    else if(result) {
      console.log("User with this email already exist!!!")
      res.status(409).send("User with this email already exist!!!")
    }
    else{
      userModel.create(req.body, (userErr, userResult) => {
        if(userErr) {
          console.error(userErr);
          res.sendStatus(403);
        }
        else{
          console.log("Server: /user/create: " + userResult.name + " created");
          res.status(200).json({
            _id: userResult._id,
            name: userResult.name,
            email: userResult.email
          });
        }
      });
    }
  });



});


module.exports = router;