const moment = require("moment");

module.exports = (message) => {
    console.log(moment.format() + " " + message);
}
