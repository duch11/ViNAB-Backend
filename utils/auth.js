const log = require("./serverLog");
const errorResolver = require("./errorResolver");
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
        errorResolver.emptyRequest(res).send();
    }
  }
  
  function findSession() {
    log.subNote("Checking session");
    userModel.findOne({_id: user_id}, (error, result) => {
      if(result) {
        checkResult(result);
      } else {
        errorResolver.notFound("Session", error, res).send();
      }
    });
  }

  function checkResult(result) {
    if(result.loggedin === true){
      log.subSuccess("Session valid");
      callback(user_id);
    } else {
      errorResolver.invalidRequest("Session",res).send();
    }
  }
}