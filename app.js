var express = require("express");
const app = express();
require("dotenv").config();
var apiRouter = require("./routes/api");
var cors = require("cors");



app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//To allow cross-origin requests

app.use(cors());

//Routes

app.get('/', function (req, res) {
    res.status(200).json({
        status: 200,
        msg: 'Welcome to Weather Service.'
    });
});

app.use(apiRouter);

// throw 404 if URL not found

app.all("*", function (req, res) {
    return res.status(404).json({
        error: true,
        code: 404,
        msg: "API Not Found"
    });
});


module.exports = app;
