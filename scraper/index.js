const express = require("express");
const cors = require("cors");
const scraper = require("./scraper");
const mongoose = require("mongoose");

const Data = require("./schema/data");

const app = express();
app.use(cors());

mongoose.connect(
  "mongodb://mongo:27017/scraper_api",
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

app.get("/api/scraper", async (req, res) => {
  const data = await scraper();
  const result = new Data(data);
  const response = await result.save();
  return res.json(response);
});

app.listen(5000, () => {
  console.log("server is running on port 5000");
});
