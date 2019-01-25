const log = require("./serverLog");

//ok, but
const HTTP_OK = 200;
const HTTP_NO_CONTENT = 202;

//client errors
const HTTP_BAD_REQUEST = 400;
const HTTP_UNAUTHORIZED = 401;
const HTTP_FORBIDDEN = 403;
const HTTP_NOT_FOUND = 404;
const HTTP_CONFLICT = 409;

//server errors
const HTTP_INTERNAL_SERVER_ERR = 500;


const err = () => {
};

//202 no content found
err.noContentFound = function(content, error, res){
    if(error) {
        return internalErrorWhile("Retrieving " + content, error, res);
    } else {
        const MESSAGE = "No " + content + " found";
        log.dbErrorWithCode(MESSAGE, HTTP_NO_CONTENT);
        res.status(HTTP_NO_CONTENT);
        return res;
    }
    
}


// 400 Bad request
err.badRequestWhile = function(action, error, res){
    if(error){
        return internalErrorWhile(action, error, res);
    } else {
        log.subError("Bad request while " + action, HTTP_BAD_REQUEST);
        res.status(HTTP_BAD_REQUEST);
        return res;
    }

}

err.emptyRequest = function(subject, res) {
    log.subError(subject + " empty", HTTP_BAD_REQUEST);
    res.status(HTTP_BAD_REQUEST);
    return res;
}

// 401
err.unauthorizedRequestWrong = function(content, res){
    res.status(HTTP_UNAUTHORIZED);
    log.errorWithCode("Wrong " + content, 401);
    return res;
}

// 403 Forbidden
err.invalidRequest = function(subject, res) {
    log.errorWithCode(subject + " invalid", HTTP_FORBIDDEN);
    res.status(HTTP_FORBIDDEN);
    return res;
}

// 404 Not found
err.notFound = function(subject, error, res) {
    if(error) {
        return internalErrorWhile("searching for " + subject, error, res);
    } else {
        const MESSAGE = subject + " not found";
        log.dbErrorWithCode(MESSAGE, HTTP_NOT_FOUND);
        res.status(HTTP_NOT_FOUND);
        return res;
    }
    
}

// 409 Conflict
err.conflicting = function(subject, res) { 
    const MESSAGE = "Conflicting " + subject; //ie email
    log.dbErrorWithCode(MESSAGE, HTTP_CONFLICT);
    res.status(HTTP_CONFLICT);
    return res;    
}

// 500 internal server error
err.internalErrorWhile = function(action, error, res) {
    const MESSAGE = "An internal error occured while " + action;
    log.dbErrorWithCode(MESSAGE, HTTP_INTERNAL_SERVER_ERR);
    res.status(HTTP_INTERNAL_SERVER_ERR);
    if(error){
        log.stackTrace(error.stackTrace);
    } else {
        log.stackTrace(action + " failed");
    }
    return res;
}




module.exports = err;