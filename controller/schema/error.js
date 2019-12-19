const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ErrorSchema = new Schema({
  site: String,
  url: String,
  roomId: String,
  message: String,
});

module.exports = mongoose.model("error", ErrorSchema);
