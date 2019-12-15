const axios = require('axios'); 
const mongoose = require('mongoose');
const dataSchema = require('./schema/schema')


mongoose.connect('mongodb://localhost:27017/scraper', {
  useUnifiedTopology: true,
  useNewUrlParser: true
});
const runner = async() => {
  const res = await axios.get('http://localhost:5000/api/scraper'); 
  console.log(res.data); 
  const result = new dataSchema(res.data); 
  
  const response = result.save(); 
  console.log(response); 
}

runner(); 