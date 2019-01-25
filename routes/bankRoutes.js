const express = require("express");
const bodyParser = require("body-parser");

const log = require("../utils/serverLog");
const errorResolver = require("../utils/errorResolver");

const auth = require("../utils/auth");
const router = express.Router();

const bankConnection = require("../APIs/bankAPI");

router.use(bodyParser.json());

router.post("/requesturl", (req, res) => {
    log.requestRecieved("POST", "/bank/requesturl");
    let userhash = req.body.userhash;
    auth.doIfLoggedIn(userhash, res, getURLFor);

    function getURLFor(userhash){
        bankConnection.getLoginUrl(userhash, (url) => {
            if(url) {
                log.subSuccess("Url recieved, sending url");
                res.status(200);
                res.send(url);
            } else {
                errorResolver.internalErrorWhile("Retrieving URL").send();
            }
        });
    }

});
module.exports = router;