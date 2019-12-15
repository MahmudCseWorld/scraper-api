const express = require('express'); 
const cors = require('cors'); 
const puppeteer = require("puppeteer-extra");
const scrapper = require('./scraper'); 

const app = express(); 
app.use(cors()); 



// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

app.get('/api/scraper', async (req, res) => {
  const browser = await puppeteer.launch({
    // will greatly affect the results
    headless: true,
    // important for running on various server where root user is present
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  }); 
  const page = await browser.newPage(); 
  const data = await scrapper(page); 
  await browser.close(); 
  res.json(data);  
})


app.listen(5000, () => {
  console.log('server is running on port 5000'); 
})