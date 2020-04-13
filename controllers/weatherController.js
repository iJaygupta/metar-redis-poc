const redisClient = require("../lib/redis");
const sendResponse = require("../lib/apiResponse").sendResponse;
const axios = require('axios');
const metarParser = require('../models/metarParser');
const API_URL = 'http://tgftp.nws.noaa.gov/data/observations/metar/stations/';
const CACHE_TIMEOUT = process.env.CACHE_TIMEOUT || 3600;

/**
 * Get Weather Data.
 *
 * @param {string}      scode
 * @param {string}      nocache
 *
 * @returns {Object}
 */


exports.getWeatherData = (request, response) => {
    let stationCode = request.query.scode;
    let nocache = request.query.nocache == 1;
    if (!stationCode) {
        return sendResponse(response, true, 400, 4002)
    }

    if (nocache) {
        getFreshDataFromMetarServer(stationCode)
            .then((data) => {
                if (data) {
                    redisClient.set(data.station,
                        JSON.stringify(data), 'EX', CACHE_TIMEOUT);
                }
                sendResponse(response, false, 200, 4001, data);
            })
            .catch((error) => {
                sendResponse(response, true, 500, 1000, error.message)
            });
    } else {
        redisClient.get(stationCode, (err, result) => {
            if (result) {
                let data = JSON.parse(result);
                sendResponse(response, false, 200, 4001, data);
            } else {
                getFreshDataFromMetarServer(stationCode)
                    .then((data) => {
                        if (data) {
                            redisClient.set(data.station,
                                JSON.stringify(data), 'EX', CACHE_TIMEOUT);
                        }
                        sendResponse(response, false, 200, 4001, data);
                    })
                    .catch((error) => {
                        sendResponse(response, true, 500, 1000, error.message);
                    });
            }
        });
    }

};


function getFreshDataFromMetarServer(stationCode) {
    return new Promise((resolve, reject) => {
        let url = API_URL + stationCode.toUpperCase() + '.TXT';
        axios.get(url)
            .then(function (response) {
                let data = response.data.split('\n')
                    .map((val) => val.trim())
                    .filter((val) => !!val);
                let jsonData = metarParser.metarParser(data[1], data[0]);
                resolve(jsonData);
            })
            .catch(function (error) {
                reject(error);
            });
    });
}


/**
 * Ping Service.
 *
 * @returns {Object}
 */

exports.ping = (request, response) => {
    let data = {
        "data": "pong"
    }
    sendResponse(response, false, 200, 4000, data)
};



