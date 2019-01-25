const express = require("express");
const userModel = require('../models/user');
const bodyParser = require('body-parser');

const log = require("../utils/serverLog");
const errorResolver = require("../utils/errorResolver");
const auth = require("../utils/auth");

const router = express.Router();
router.use(bodyParser.json());

/**
 * user/login
 * Login user (if he exists in the database)
 */
router.post("/login", (req, res) => {
  log.requestRecieved("POST", "/user/login");
  // empty body?
  checkForEmptyCredentials();

  function checkForEmptyCredentials() {
    if(req.body.email && req.body.password){
      findUser();
    } else {
      errorResolver.emptyRequest("Email or password").send();
    }
  }

  function findUser(){
    log.subNote("looking for user");
    userModel.findOne({email: req.body.email}, (error, result) => {
      if (result) {
        // user found
        log.subSuccess("User found in database");
        checkPassword(result);
      } else {
        errorResolver.notFound("User", error, res).send();
      }
    });
  }

  function checkPassword(result){
    log.subNote("Checking password");
    if(result.password != req.body.password) {
      // bad password
      errorResolver.unauthorizedRequestWrong("Password", res);      
    } else {
      // password match
      log.subSuccess("Passwords match!")
      updateStatusFor(result.email);
    }
  }

  function updateStatusFor(userEmail){
    log.subNote("Updating users login status");
    // update status
    userModel.findOneAndUpdate({email: userEmail}, {loggedin: true}, (error, result) => {
      if(result) {
        log.subSuccess(result.email + " loggedin status updated to " + result.loggedin);
        res.json({
          "_id":result._id,
          "email": result.email,
          "name":result.name
        });
      } else {
        errorResolver.notFound("a user to update", error, res).send("Login failed");
      }       
    });
  }
});

/**
 * user/logout
 * Log user out of the account
 */
router.post("/logout", (req, res) => {
  log.requestRecieved("post", "/user/logout");

  var user = {}
  user._id = req.body._id;

  auth.doIfLoggedIn(req.body._id, res, logOff);

  function logOff(validUserID){
    userModel.findOneAndUpdate({_id: validUserID},{loggedin: false}, (error, result) => {
      if (result) {
        log.subSuccess(result.name + " logged out!");
        res.sendStatus(200);
      } else {
        var message = "Logging out user with userID: " + validUserID;
        errorResolver.internalErrorWhile(message).send(message);
      }
    });
  }
  // log off
  
});


/**
 * user/create
 * check if user with this email exist, if not then create new one
 */
router.post("/create", (req, res) => {
  log.requestRecieved("POST", "/user/create");

  userModel.findOne({email: req.body.email}, (error, result) => {
    if(result) {
      errorResolver.conflicting("Email; Email taken", res).send("Email taken");
    } else if (error) {
      errorResolver.internalErrorWhile("Looking for email conflicts").send();
    } else {
      // not found, thereby available
      createUser();
    }
  });

  function createUser(){
    userModel.create(req.body, (error, result) => {
      // create error
      if(result) {
        // created
        log.subSuccess(result.name + " Created");
        res.status(200);
        res.json({
          _id: result._id,
          name: result.name,
          email: result.email
        });

      } else {
        errorResolver.badRequestWhile("Creating User", error, res).send();
      }
    });
  }

});

module.exports = router;