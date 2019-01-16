const log = require("./serverLog");
const err = require("./errorResolver");
const userModel = require('../models/user');

/**
 * check if user is logged in before executing any action
 */
module.exports.doIfLoggedIn = (user_id = "null", res, callback) => {

  checkForNull();
  
  function checkForNull() {
    log.subNote("Checking userhash");
  
    if(user_id !== "null") {
        log.subSuccess("Userhash present");
        findSession();
    } else {
        err.empty(res);
    }
  }
  
  function findSession() {
    log.subNote("Checking session");
    userModel.findOne({_id: user_id}, (error, result) => {
      if(result) {
        checkResult(result);
      } else {
        err.notFound("Session", error, res);
      }
    });
  }

  function checkResult(result) {
    if(result.loggedin === true){
      log.subSuccess("Session valid");
      callback(user_id);
    } else {
      err.invalid("Session",res);
    }
  }
}







