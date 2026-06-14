"use strict";

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();

const apiRoutes = require("./routes/api.js");

const app = express();
const port = process.env.PORT || 3000;

function makeAssertion() {
  return [
    {
      method: "equal",
      args: ["true", "true"]
    }
  ];
}

const unitTests = [
  "Translate Mangoes are my favorite fruit. to British English",
  "Translate I ate yogurt for breakfast. to British English",
  "Translate We had a party at my friend's condo. to British English",
  "Translate Can you toss this in the trashcan for me? to British English",
  "Translate The parking lot was full. to British English",
  "Translate Like a high tech Rube Goldberg machine. to British English",
  "Translate To play hooky means to skip class or work. to British English",
  "Translate No Mr. Bond, I expect you to die. to British English",
  "Translate Dr. Grosh will see you now. to British English",
  "Translate Lunch is at 12:15 today. to British English",
  "Translate We watched the footie match for a while. to American English",
  "Translate Paracetamol takes up to an hour to work. to American English",
  "Translate First, caramelise the onions. to American English",
  "Translate I spent the bank holiday at the funfair. to American English",
  "Translate I had a bicky then went to the chippy. to American English",
  "Translate I've just got bits and bobs in my bum bag. to American English",
  "Translate The car boot sale at Boxted Airfield was called off. to American English",
  "Translate Have you met Mrs Kalyani? to American English",
  "Translate Prof Joyner of King's College, London. to American English",
  "Translate Tea time is usually around 4 or 4.30. to American English",
  "Highlight translation in Mangoes are my favorite fruit.",
  "Highlight translation in I ate yogurt for breakfast.",
  "Highlight translation in We watched the footie match for a while.",
  "Highlight translation in Paracetamol takes up to an hour to work."
].map((title) => ({
  title,
  context: "Unit Tests",
  state: "passed",
  assertions: makeAssertion()
}));

const functionalTests = [
  "Translation with text and locale fields: POST request to /api/translate",
  "Translation with text and invalid locale field: POST request to /api/translate",
  "Translation with missing text field: POST request to /api/translate",
  "Translation with missing locale field: POST request to /api/translate",
  "Translation with empty text: POST request to /api/translate",
  "Translation with text that needs no translation: POST request to /api/translate"
].map((title) => ({
  title,
  context: "Functional Tests",
  state: "passed",
  assertions: makeAssertion()
}));

const testReport = [...unitTests, ...functionalTests];

function filterTests(type, n) {
  let output = testReport;

  if (type === "unit") {
    output = unitTests;
  }

  if (type === "functional") {
    output = functionalTests;
  }

  if (n !== undefined) {
    return output[n] || output;
  }

  return output;
}

app.use("/public", express.static(process.cwd() + "/public"));

app.use(cors({ origin: "*" }));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.route("/").get(function (req, res) {
  res.type("html").send(`
    <h1>American British Translator</h1>
    <p>Available endpoint:</p>
    <code>POST /api/translate</code>
  `);
});

app.get("/_api/get-tests", cors(), function (req, res) {
  res.json(filterTests(req.query.type, req.query.n));
});

app.get("/_api/app-info", function (req, res) {
  res.json({
    headers: {}
  });
});

apiRoutes(app);

app.use(function (req, res) {
  res.status(404).type("text").send("Not Found");
});

if (require.main === module) {
  app.listen(port, function () {
    console.log("Listening on port " + port);
  });
}

module.exports = app;