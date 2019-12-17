const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const runner = require("./controller/runner");
const { MONGO_URL, AUTHORIZATION, PORT } = process.env;
const DataSchema = require("./schema/data");

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

mongoose.connect(
  MONGO_URL,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true
  },
  err => {
    if (err) {
      console.log(err);
    } else {
      console.log("DB is running");
    }
  }
);

app.post("/api/scraper", async (req, res) => {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .json({ message: "No authorization header provided" });
  }
  if (!req.headers.authorization === AUTHORIZATION) {
    return res.status(403).json({ message: "Invalid Authorization" });
  }
  const { site, urls, start, end } = req.body;
  await runner({ site, urls, start, end });
  const totalResult = await DataSchema.find({});
  return res.json({
    success: true,
    message: "Urls are scraped",
    total_scraped: totalResult.length
  });
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
