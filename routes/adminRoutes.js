const express = require("express");
const userModel = require('../models/user');
const accountModel = require("../models/account");
const bodyParser = require('body-parser');
const log = require("../utils/serverLog");

const router = express.Router();
router.use(bodyParser.json());

/**
 * admin/getallusers
 * Return all existing users.
 */
router.get("/getallusers", (req, res) => {
  log.requestRecieved("GET", "/admin/getallusers");
  if(req.query.adminCode !== "1234") {
    // wrong pass
    log.errorWithCode("Wrong password", 401);
    res.sendStatus(401);

  } else {
    // good pass
    log.subNote("Looking for users");
    userModel.find((err, result) =>{
      if(result) {
        // send users
        log.subSuccess("Users found!");
        res.json(result);
      } else {
        log.subSuccess("Sending empty users list");
        // no users to send
        res.json();
      }
    });
  }
});


/**
 * admin/deleteuser
 * deletes user
 */
router.post("/deleteuser", (req, res) => {
  log.requestRecieved("POST", "/admin/deleteuser");

  //looking for user to delete
  userModel.findByIdAndDelete({_id: req.body._id}, (error, result) => {
    if(error){
      log.dbErrorWithCode("", 500);
      log.stackTrace(error.stackTrace);
      res.sendStatus(500);
    } else if(!result) {
      log.errorWithCode("User not found", 404);
      res.send("User not found", 404);
    } else {
      log.subSuccess("User with id: "+ result._id +" got deleted");
      res.send("User with id: "+ result._id +" got deleted", 200);

      accountModel.deleteMany({owner_id: result._id}, (err) =>{
        if(err){
          log.subError("No accounts found for " + result.name);
          log.stackTrace(err.stackTrace);
        } else {
          log.subSuccess("Deleted all accounts for user: " + result.name);
        }
      });
    }
  });
});


module.exports = router;