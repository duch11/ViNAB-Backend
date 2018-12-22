const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const log = require("./utils/serverLog");


const PORT = 3000;
const app = express();

// *********** Include the Api routes ***********
const accountRoutes = require("./routes/accountRoutes");
const userRoutes = require("./routes/userRoutes");
const adminRoutes = require("./routes/adminRoutes");
const bankRoutes = require("./routes/bankRoutes");

// *********** Connect to Mongo  ***********
log.note("Attempting to connect to mongoose");

mongoose.connect("mongodb://admin:admin1@ds231133.mlab.com:31133/fullstack_db", {useNewUrlParser: true})
  .then(() => {
    log.success("Connected to Mongo database!");
  })
  .catch(err  => {
    log.error("Mongo database connection failed.");
    log.stackTrace(err.stack);
  });

app.use(bodyParser.json());

function setHeaders(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers',
      'Origin, X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  res.setHeader(
      'Access-Control-Allow-Methods',
      'GET, POST, PUT, PATCH, DELETE, OPTIONS');

  next();
};

app.use(setHeaders);



// ******** Setup the Api routes ***********
app.use("/account", accountRoutes);
app.use("/user", userRoutes);
app.use("/admin", adminRoutes);
app.use("/bank", bankRoutes);

// App listen
app.listen(PORT, () => {
  log.success("Server listening at port " + PORT);
});

module.exports = app;
