const express = require("express");
const bodyParser = require("body-parser");
const log = require("../utils/serverLog");
const auth = require("../utils/auth");
const router = express.Router();

const bankConnection = require("../APIs/bankAPI");

router.use(bodyParser.json());

router.post("/requesturl", (req, res) => {
    log.requestRecieved("POST", "/bank/requesturl");
    let userhash = req.body.userhash;
    auth.doIfLoggedIn(userhash, res, () => {
        bankConnection.getLoginUrl(userhash, (url) => {
            if(url) {
                log.subSuccess("Url recieved, sending url");
                res.send(url);
            } else {
                log.errorWithCode("no url found", 500);
                res.sendStatus(500);
            }
        });
    });

});

handleError = (error, response) => {
  log.dbErrorWithCode("", 403);
  log.stackTrace(error.stackTrace);
  response.sendStatus(403);
}

module.exports = router;