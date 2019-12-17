const express = require("express");
const cors = require("cors");
const scraper = require("./scraper");
const mongoose = require("mongoose");

const Data = require("./schema/data");
const { MONGO_URL, AUTHORIZATION, PORT } = process.env;

const app = express();
app.use(cors());

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

app.get("/api/scraper", async (req, res) => {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .json({ message: "No authorization header provided" });
  }
  if (!req.headers.authorization === AUTHORIZATION) {
    return res.status(403).json({ message: "Invalid Authorization" });
  }
  const data = await scraper();
  const result = new Data(data);
  const response = await result.save();
  return res.json(response);
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
