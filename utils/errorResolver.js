const log = require("./serverLog");

const HTTP_BAD_REQUEST = 400;
const HTTP_FORBIDDEN = 403;
const HTTP_NOT_FOUND = 404;
const HTTP_INTERNAL_SERVER_ERR = 500;


const err = () => {
};

// call when no result found
err.notFound = function(subject, error, res) {
    if(error) {
        log.dbErrorWithCode("", HTTP_INTERNAL_SERVER_ERR);
        log.stackTrace(error.stackTrace);
        res.status(HTTP_INTERNAL_SERVER_ERR);
        res.send();
    } else {
        const MESSAGE = subject + " not found";
        log.errorWithCode(MESSAGE, HTTP_NOT_FOUND);
        res.status(HTTP_NOT_FOUND);
        res.send(MESSAGE);
    }
}

err.internalErrorWhile = function(action, error) {
    if(error){
        log.dbErrorWithCode("", HTTP_INTERNAL_SERVER_ERR);
        log.stackTrace(error.stackTrace);
    } else {
        const MESSAGE = action + " failed";
        log.dbErrorWithCode(MESSAGE, HTTP_INTERNAL_SERVER_ERR);
    }
    res.sendStatus(HTTP_INTERNAL_SERVER_ERR);
}



err.empty = function(subject, res) {
    log.subError(subject + " empty", HTTP_BAD_REQUEST);
    res.sendStatus(HTTP_BAD_REQUEST);
}

err.invalid = function(subject, res) {
    log.errorWithCode(subject + " invalid", HTTP_FORBIDDEN);
    res.sendStatus(HTTP_FORBIDDEN);
}

module.exports = err;