const mongoose = require('mongoose');
const Schema = mongoose.Schema;

  const blogSchema = new Schema({
    header: String, 
    title: String
  });


module.exports = mongoose.model('scrapData', blogSchema); 