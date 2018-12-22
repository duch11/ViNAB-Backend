const clientRequest = require("request");
const express = require("express");
const log = require("../utils/serverLog");

const app = express();
const port = process.env.PORT || 3000;


app.listen(port, function () {
    log.note("nordicBankConnect Express server started on port: " + port);
});

clientRequest.debug = false;

app.get("/login", (req, res) => {
    //do request
    log.requestRecieved("GET", "/login");
    log.subNote("Requesting code from NordicWeb");

    //Define request settings
    const requestHeaders = {
        url: 'https://api.nordicapigateway.com/v1/authentication/initialize',
        headers: {
          'Content-Type':'application/json',
          'X-Client-Id':'jonasholmcorp-79c41322-c43b-4724-ac72-f2968e088bbf',
          'X-Client-Secret':'a8fdba9a7d8f3966fa6c902dd0864dfb859fc25c3c718eaee5d844d1922a31e1'
        },
        body: JSON.stringify({
          "userHash": "abcdefssg1234",
          "redirectUrl": "http://localhost:"+ port + "/authenticated"
        })
    };

    // send request
    clientRequest.post(requestHeaders, (error, response, body) => {
        // body
        log.subSuccess("Got following body: " + body);
        var jsonresponse = JSON.parse(body);
        log.subNote("Converted to JSON, showing AUTHURL: " + jsonresponse.authUrl);
        // error
        if(error){
            log.subError("there was an error: " + error);
        }
        // response from containing login method
        res.redirect(jsonresponse.authUrl);
    });
});

app.get("/authenticated", (req, res) => {
    log.requestRecieved("GET","/authenticated");
    log.subNote("Code received: " + req.query.code);
    res.send("<html> <head></head> <body><h1>Got request code: </h1> <p style='width: 50%; word-wrap: break-word;'>"+req.query.code+"</p></body></html>");
});
