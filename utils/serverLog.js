const moment = require("moment");
const chalk = require('chalk');

const DIVIDER = " :: ";
const ARROW = "⮡ ";
const TIMEFORMAT = "DD/MM HH:mm:ss";

const log = () => {
};

const getMoment = () => {
    return chalk.yellowBright( moment().format(TIMEFORMAT) ) + DIVIDER;
}

log.success = (message) => {
    console.log(getMoment() + chalk.green(message));
}

log.subSuccess = (message) => {
    console.log(getMoment() + ARROW + chalk.green(message));
}

log.note = (message) => {
    console.log(getMoment() + message + "...");
}

log.subNote = (message) => {
    log.note(ARROW+message);
}

log.requestRecieved = (httpMethod, URL) => {
    log.note(String(httpMethod).toUpperCase() + " " + String(URL).toLowerCase() + " request recieved");
}

log.stackTrace = (message) => {
    console.log(chalk.red("====================== [ERROR] ======================"));
    console.log(chalk.red(message));
}

log.error = (message) => {
    console.log(getMoment() + chalk.red(message));
}

log.subError = (message) => {
    console.log(getMoment() + ARROW + chalk.red(message));
}

log.dbErrorWithCode = (message,code) => {
    if(!message){
        message = "Unknown, see stacktrace";
    }
    log.subError("Database: " + message + ". Response: " + code);
}
/*sub error with a code*/
log.errorWithCode = (message,code) => {
    if(!message){
        message = "Unknown, see stacktrace";
    }
    log.subError(message + ". Response: " + code);
}

module.exports = log;