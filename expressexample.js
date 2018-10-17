var express = require('express');
var moment = require('moment');
var mongoose = require('mongoose');

var app = express();

//mylittlefirefriendfromtealand hisnameismrpotty101
//mongodb://<dbuser>:<dbpassword>@ds225703.mlab.com:25703/test_server_mongo_db
mongoose.connect(
    'mongodb://mylittlefirefriendfromtealand:hisnameismrpotty101@ds225703.mlab.com:25703/test_server_mongo_db'
    ).catch(() =>{
        console.log("ERROR!!!Connection to database not working.");
});

//Request timer
var myRequestTimer = function(req, res, next) {
    req.myDearRequestTimer = moment().format();
    next();
}

app.use(myRequestTimer);

//MongoDB Schema setup
var Schema = mongoose.Schema;
var userSchema = new Schema({ name: String, status: String});
var userSchemaz2 = new Schema({ namez: String, statusez: String});
var Userz2 = mongoose.model('User2',userSchemaz2);
var User = mongoose.model('User', userSchema);

//Listen to port
var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Express server started!"); 
    console.log("Listening on port: " + port); 
});

//Request mappings
app.get("/greet", function (req, res) {
    console.log('GET Recieved: ' + req.myDearRequestTimer);
    res.send('hello world!');
});

app.post("/greet", function (req, res) {
    console.log('POST Recieved: ' + req.myDearRequestTimer);
    res.send('hello world!');
});
app.delete("/greet", function (req, res) {
    console.log('DELETE Recieved: ' + req.myDearRequestTimer);
    res.send('hello world!');
});
app.put("/greet", function (req, res) {
    console.log('PUT Recieved: ' + req.myDearRequestTimer);
    res.send('hello world!');
});

//user test
var john = User({ name: 'Jonasthan', status: 'aktiv'});
john.save(function(err){
    if(err) throw err;
    console.log("User saved!! :D ");
});

//new user test
var jane = Userz2({
    namez: 'Janathan', statusez: 'Naziktiv'
});
jane.save(function(error){
    if(error) throw error;
    console.log("Jane User saved!! :(");
});