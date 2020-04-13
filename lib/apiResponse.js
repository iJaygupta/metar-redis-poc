const responseFile = require('./responseMsg');

exports.sendResponse = function (response, error, statusCode, responseCode, data) {
    let output = {
        error: error,
        msg: responseFile[responseCode]['msg'],
        code: responseFile[responseCode]['code'],
    }
    if (data) {
        output.data = data;
    }
    response.status(statusCode).send(output);
}

