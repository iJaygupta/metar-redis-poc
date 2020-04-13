var express = require("express");
var weatherRouter = require("./weatherService");

var app = express();

app.use("/metar/", weatherRouter);

module.exports = app;