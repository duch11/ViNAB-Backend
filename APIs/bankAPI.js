const clientRequest = require("request");
const log = require("../utils/serverLog");

module.exports.getLoginUrl = (userHash, callback) => {

     //Define request settings
    const requestHeaders = {
        url: 'https://api.nordicapigateway.com/v1/authentication/initialize',
        headers: {
          'Content-Type':'application/json',
          'X-Client-Id':'jonasholmcorp-79c41322-c43b-4724-ac72-f2968e088bbf',
          'X-Client-Secret':'a8fdba9a7d8f3966fa6c902dd0864dfb859fc25c3c718eaee5d844d1922a31e1'
        },
        body: JSON.stringify({
          "userHash": userHash,
          "redirectUrl": "http://localhost:"+ port + "/authenticated"
        })
    };

    log.subNote("Getting URL for: " + userHash);
    // send request
    clientRequest.post(requestHeaders, (error, response, body) => {
        if(error){
            log.subError("An error occured: ");
            log.stackTrace(error.stackTrace);
            callback();
        } else if(body) {
            log.subSuccess("Got following body: " + body);
            var jsonresponse = JSON.parse(body);
            log.subNote("Converted to JSON, showing AUTHURL: " + jsonresponse.authUrl);
            callback(jsonresponse.authUrl);
        }

    });
};