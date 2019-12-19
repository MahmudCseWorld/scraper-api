const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const DataSchema = new Schema({
  site: String,
  url: String,
  roomId: String,
  headline: String,
  total_review: String,
  last_review_date: String,
  description: String
});

module.exports = mongoose.model("data", DataSchema);
