var request = require('request');
var express = require("express");
var app = express();
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Express server started!"); 
    console.log("Listening on port: " + port); 
});
var fs = require('fs');
var file = fs.createWriteStream("response.json");
var opn = require('opn');
request.debug =false;

var loginNordicWeb = function(req, res){
    //do request
    console.log("Requesting code");
    

    //Define request
    var step1options = {
        url: 'https://api.nordicapigateway.com/v1/authentication/initialize',
        headers: {
          'Content-Type':'application/json',
          'X-Client-Id':'jonasholmcorp-79c41322-c43b-4724-ac72-f2968e088bbf',
          'X-Client-Secret':'a8fdba9a7d8f3966fa6c902dd0864dfb859fc25c3c718eaee5d844d1922a31e1'
        },
        body: JSON.stringify({
          "userHash": "abcdefssg1234",
          "redirectUrl": "localhost:"+ port + "/authenticated"
        })
    };

    //ready callback
    function callback(error, response, body) {
        console.log("body: " + body);
        file.write(body);
        file.end();
        console.log("response: " + response);
        console.log("error: " + error);
        var jsonresponse = JSON.parse(body);
        console.log(jsonresponse.authUrl);
        //opn(jsonresponse.authUrl); to open from console commented
        // needs rework res.redirectUrl(jsonresponse.authUrl);
        //res.redirectUrl = jsonresponse;
        res.redirect(jsonresponse.authUrl);
    };

    request.post(step1options, callback);
};

var useCodeFromAuthentication = function(req, res){
    console.log("usecodefromauthentication");

};

app.get("/login", loginNordicWeb);
app.get("/authenticated/:code", useCodeFromAuthentication);


/*
curl -H 'X-Client-Id: INSERT_CLIENT_ID' \
    -H 'X-Client-Secret: INSERT_CLIENT_SECRET' \
    -X POST -H 'Content-Type: application/json' \
    -d '{""userHash"": ""test-user-id"", ""redirectUrl"": ""https://httpbin.org/anything""}' \
    https://api.nordicapigateway.com/v1/authentication/initialize
*/
 

 
