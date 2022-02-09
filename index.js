/**
 * Include our sort function
 */
const sortCategoriesForInsert = require("./src/sort-categories-for-insert");

/**
 * Include express and declare its variables
 */
const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 8080;

/**
 * Declare the various endpoints we'll need
 */
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
});

app.get("/api", function (req, res) {
  let data = prepareResponse("./data/data.json", req);
  res.json(data);
});

app.get("/api/small", function (req, res) {
  let data = prepareResponse("./data/data-small.json", req);
  res.json(data);
});

app.get("/api/large", function (req, res) {
  let data = prepareResponse("./data/data-large.json", req);
  res.json(data);
});

/**
 * Start the express server and notify the user in the console
 */
app.listen(port);
console.log("Server started at http://localhost:" + port);

/**
 * Function that prepares the response payload
 * @param    {String} url    Path of the file to load
 * @param    {Object} req    Express request param
 * @return   {String}        A JSON string
 */
const prepareResponse = function (url, req) {
  let dataFile = require(url);
  let dataString = JSON.stringify(dataFile);
  let flatten = req.query.flatten ? true : false;
  let raw = req.query.raw ? true : false;

  if (raw) {
    return JSON.stringify(dataFile);
  } else {
    return sortCategoriesForInsert(dataString, flatten);
  }
};
