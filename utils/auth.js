const log = require("./serverLog");
const userModel = require('../models/user');

/**
 * check if user is logged in before executing any action
 */
module.exports.doIfLoggedIn = (user_id, res, callback) => {
  log.subNote("Checking session");

  userModel.findOne({_id: user_id}, (error, result) => {
    if(result) {
      if(result.loggedin === true){
        log.subSuccess("Session valid");
        callback(user_id);
      } else {
        log.errorWithCode("Session invalid", 401);
        res.status(401);
        res.send();
      }
    } else {
      if(error) {
        log.dbErrorWithCode("", 401);
        log.stackTrace(error.stackTrace);
      } else {
        log.errorWithCode("No result", 401);
      }

      res.status(401);
      res.send();
    }
  });
}

