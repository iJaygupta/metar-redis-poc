var express = require("express");
const weatherController = require("../controllers/weatherController");

var router = express.Router();


router.get("/ping", weatherController.ping);
router.get("/info", weatherController.getWeatherData);


module.exports = router;