const express = require("express");
const accountModel = require('../models/account');

const log = require("../utils/serverLog");
const err = require("../utils/errorResolver");

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
  let reqOwnerId = "null";
  reqOwnerId = req.query.owner_id;

  log.requestRecieved("GET", "/account/getall Params: " + reqOwnerId);

  auth.doIfLoggedIn(reqOwnerId, res, () => {
    findAccount();
  });

  function findAccount(){
    accountModel.find({owner_id: reqOwnerId}, (accountError, accountResult) => {
      if(accountResult) {
        sendAccounts();
      } else {
        sendNoAccounts();
      }
    });
  }

  function sendAccounts(){
    // send accounts
    log.subSuccess("Found " + accountResult.length + " accounts for " + reqOwnerId);
    res.json(accountResult);
  }

  function sendNoAccounts(){
    // no accounts to send
    log.subError("No result for query on id: " + reqOwnerId);
    res.json();
  }
});


/**
 * account/create
 * Create new account for user that is logged in
 */
router.post("/create", (req, res) => {
  log.requestRecieved("POST", "/account/create " + req.body.owner_id + " " + req.body.nickName);

  auth.doIfLoggedIn(req.body.owner_id, res, () => {
    createAccount();
  }); // end of doIfLoggedIn + callback

  function createAccount() {
    log.subNote("Creating account for userID: " + req.body.owner_id);
    accountModel.create(req.body, (error, result) => {
      if (result) {
        accountCreated(result);
      } else {
        createFailed(error);
      }
    }); // end of accountmodel.create
  }

  function accountCreated(result){
    log.subSuccess("Account " + result.nickName + " created!");
    res.status(200);
    res.json(result);
  }

  function createFailed(error){
    if(error){
      log.dbErrorWithCode("", 500);
      log.stackTrace(error.stackTrace);
      res.sendStatus(500);
    }
  }
}); // end of post(/create)

/**
 * account/update
 *  update user if he is logged in
 */
router.post("/update", (req, res) => {
  log.requestRecieved("POST", "/account/update "+ req.body.owner_id + " " + req.body.nickName);

  auth.doIfLoggedIn(req.body.owner_id, res, () => {
    updateAccount();
  }); // end of doIfLoggedIn + callback

  function updateAccount(){
    log.subNote("Updating account: " + req.body.nickName);
    accountModel.findByIdAndUpdate({_id: req.body._id}, req.body, (error, result) => {
      if(result){
        confirmUpdate(result);
      } else {
        updateFailed(error);
      }
    }); // end of accountmodel.create
  }

  function confirmUpdate(result){
    log.subSuccess("Account updated");
    res.status(200);
    res.json(result);
  }

  function updateFailed(error){
    if(error){
      log.dbErrorWithCode("", 500);
      log.stackTrace(error.stackTrace);
    } else {
      log.errorWithCode("Update failed", 500);
    }
    res.sendStatus(500);
  }
});


/**
 * account/delete
 * delete user if he is logged in
 */
router.post("/delete", (req, res) => {
  log.requestRecieved("POST", "/account/delete " + req.body.owner_id + " " + req.body.nickName);
  auth.doIfLoggedIn(req.body.owner_id, res, () => {
    deleteAccount();
  }); // end of doIfLoggedIn + callback

  function deleteAccount() {
    accountModel.findByIdAndDelete({_id: req.body._id}, (error, result) => {
      if(result){
        confirmDelete(result);
      } else {
        deleteFailed(error);
      }
    }); // end of accountmodel.create
  }

  function confirmDelete(result) {
    log.subSuccess("Account deleted");
    res.status(200);
    res.json(result);
  }
  
  function deleteFailed(error){
    if(error){
      log.dbErrorWithCode("", 500);
      log.stackTrace(error.stackTrace);
    } else {
      log.errorWithCode("Delete failed", 500);
    }
    res.sendStatus(500);
  }
});




module.exports = router;
