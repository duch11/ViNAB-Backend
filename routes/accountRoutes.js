const express = require("express");
const accountModel = require('../models/account');

const log = require("../utils/serverLog");

const bodyParser = require('body-parser');

const auth = require("../utils/auth");

const router = express.Router();
router.use(bodyParser.json());

/**
 * account/getall
 * Returns all accounts for user that is logged in.
 */
router.get("/getall", (req, res) => {
  //req.params.[param] for /rout/[param]/page
  //req.query for things after ?[param]=213
  log.requestRecieved("GET", "/account/getall Params: " + req.query.owner_id);

  auth.doIfLoggedIn(req.query.owner_id, res, (id) => {
    accountModel.find({owner_id: id}, (accountError, accountResult) => {
      if(accountResult) {
        // send accounts
        log.subSuccess("Found " + accountResult.length + " accounts for " + id);
        res.json(accountResult);
      } else {
        // no accounts to send
        log.subError("No result for query on id: " + id);
        res.json();
      }
    });
  });
});


/**
 * account/create
 * Create new account for user that is logged in
 */
router.post("/create", (req, res) => {
  log.requestRecieved("POST", "/account/create " + req.body.owner_id + " " + req.body.nickName);

  auth.doIfLoggedIn(req.body.owner_id, res, (id) => {
    log.subNote("Creating account for userID: " + id);
    accountModel.create(req.body, (error, result) => {
      if (result) {
        log.subSuccess("Account " + result.nickName + " created!");
        res.status(200);
        res.json(result);
      } else {
        if(error){
          log.dbErrorWithCode("", 500);
          log.stackTrace(error.stackTrace);
          res.sendStatus(500);
        }
      }
    }); // end of accountmodel.create
  }); // end of doIfLoggedIn + callback
}); // end of post(/create)

/**
 * account/update
 *  update user if he is logged in
 */
router.post("/update", (req, res) => {
  log.requestRecieved("POST", "/account/update "+ req.body.owner_id + " " + req.body.nickName);

  auth.doIfLoggedIn(req.body.owner_id, res, (id) => {
    log.subNote("Updating account: " + req.body.nickName);
    accountModel.findByIdAndUpdate({_id: req.body._id}, req.body, (error, result) => {
      if(result){
        log.subSuccess("Account updated");
        res.status(200);
        res.json(result);
      } else {
        if(error){
          log.dbErrorWithCode("", 500);
          log.stackTrace(error.stackTrace);
        } else {
          log.errorWithCode("Update failed", 500);
        }
        res.sendStatus(500);
      }
    }); // end of accountmodel.create
  }); // end of doIfLoggedIn + callback
});


/**
 * account/delete
 * delete user if he is logged in
 */
router.post("/delete", (req, res) => {
  log.requestRecieved("POST", "/account/delete " + req.body.owner_id + " " + req.body.nickName);
  auth.doIfLoggedIn(req.body.owner_id, res, (id) => {

    accountModel.findByIdAndDelete({_id: req.body._id}, (error, result) => {
      if(result){
        log.subSuccess("Account deleted");
        res.status(200);
        res.json(result);
      } else {
        if(error){
          log.dbErrorWithCode("", 500);
          log.stackTrace(error.stackTrace);
        } else {
          log.errorWithCode("Delete failed", 500);
        }
        res.sendStatus(500);
      }

    }); // end of accountmodel.create
  }); // end of doIfLoggedIn + callback
});


module.exports = router;
