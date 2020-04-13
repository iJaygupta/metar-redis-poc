'use strict';

function log(...args) {
    process.env.LOGGING && console.log(...args);
}

function debug(...args) {
    process.env.DEBUG && console.log(...args);
}

const logger = {
    debug: debug,
    error: log,
    info: log,
};

module.exports = logger;
