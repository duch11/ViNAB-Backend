const express = require("express");
const userModel = require('../models/user');
const accountModel = require("../models/account");
const bodyParser = require('body-parser');

const log = require("../utils/serverLog");
const errorResolver = require("../utils/errorResolver");

const router = express.Router();
router.use(bodyParser.json());

const PASSWORD = "1234";

/**
 * admin/getallusers
 * Return all existing users.
 */
router.get("/getallusers", (req, res) => {
  log.requestRecieved("GET", "/admin/getallusers");
  if(req.query.adminCode !== PASSWORD) {
    errorResolver.unauthorizedRequestWrong("Password",res).send();
  } else {
    // good pass
    log.subNote("Looking for users");
    userModel.find((error, result) =>{
      if(result) {
        // send users
        log.subSuccess("Users found!");
        res.json(result);
      } else {
        errorResolver.noContentFound("Users", error, res).json();
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
    if(result){
      log.subSuccess("User with id: "+ result._id +" got deleted");
      deleteAccounts();
    } else {
      errorResolver.notFound("User", error, res).send();
    }

    function deleteAccounts(){
      accountModel.deleteMany({owner_id: result._id}, (err, document) =>{
        if(document.acknowledged) {
          log.subSuccess("Deleted all accounts for user: " + result.name);
          res.status(200);
        } else {
          errorResolver.noContentFound("Accounts to delete for user: " + result.name, err, res);
        }
        res.send("User with id: "+ result._id +" got deleted");
      });
    }

  });
});


module.exports = router;