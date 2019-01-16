const express = require("express");
const userModel = require('../models/user');
const bodyParser = require('body-parser');
const log = require("../utils/serverLog");
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
      sendEmptyCredentialsError();
    }
  }

  function sendEmptyCredentialsError(){
    log.dbErrorWithCode("Email or password empty", "403");
    res.sendStatus(403);
  }

  function findUser(){
    log.subNote("looking for user");
    userModel.findOne({email: req.body.email}, (error, result) => {
      if (result) {
        // user found
        log.subSuccess("User found in database");
        checkPassword(result);
      } else {
        sendUserNotFound(error);
      }
    });
  }

  function sendUserNotFound(error){
    if(error) {
      log.dbErrorWithCode("While finding user, an error occured", 403);
      log.stackTrace(error.stackTrace);
      response.sendStatus(403);
    } else {
      // user not found
      log.errorWithCode("User not found", 403);
      res.status(403).send("User not found");
    }
  }

  function checkPassword(result){
    if(result.password != req.body.password) {
      // bad password
      log.errorWithCode("Wrong password", 403);
      res.status(403).send("Wrong password");
    } else {
      // password match
      log.subSuccess("Passwords match!")
      updateStatus();
    }
  }

  function updateStatus(){
    // update status
    userModel.findOneAndUpdate({email: result.email}, {loggedin: true}, (error, result) => {
      if(result) {
        sendLoginSuccess();
      } else {
        sendLoginFailed();
      }

      function sendLoginFailed(){
        log.dbErrorWithCode("Update user.loggedin, failed", 403);
        if(error) {
          log.stackTrace(error.stackTrace)
          res.status(403).send("Login failed");
        }
      }

      function sendLoginSuccess() {
        log.subSuccess(result.email + " loggedin status updated to " + result.loggedin);
        res.json({
          "_id":result._id,
          "email": result.email,
          "name":result.name
        });
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

  // log off
  userModel.findOneAndUpdate({_id: user._id},{loggedin: false}, (error, result) => {

    if (result) {
      log.subSuccess(result.name + " logged out, Response: 200");
      res.status(200).send();
    } else {
      if(error) {
        log.dbErrorWithCode("", 403);
        log.stackTrace(error.stackTrace);
        response.sendStatus(403);
      } else {
        log.errorWithCode("User not logged out", 500);
        response.sendStatus(500);
      }
    }
  });
});


/**
 * user/create
 * check if user with this email exist, if not then create new one
 */
router.post("/create", (req, res) => {
  log.requestRecieved("POST", "/user/create");

  userModel.findOne({email: req.body.email}, (error, result) => {
    if(error){
      // db error
      log.dbErrorWithCode("", 403);
      log.stackTrace(error.stackTrace);
      res.sendStatus(403);

    } else if(result) {
      // email taken
      log.subError("Email taken, Response 409");
      res.status(409).send("Email taken");

    } else {
      // not found, thereby available
      userModel.create(req.body, (error, result) => {
        // create error
        if(error) {
          log.dbErrorWithCode("", 403);
          log.stackTrace(error.stackTrace);
          res.sendStatus(403);
        } else {
          // created
          log.subSuccess(result.name + " Created");
          res.status(200).json({
            _id: result._id,
            name: result.name,
            email: result.email
          });
        }
      });
    }
  });
});

module.exports = router;