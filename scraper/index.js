require('dotenv').config({ path: './.env' });

const express = require("express");
const bodyParser = require("body-parser");

const scraper = require("./lib/scraper");
const createBrowser = require('./lib/browser');

const { AUTHORIZATION, PORT } = process.env;

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }));

let browser;

app.post("/api/scraper", async (req, res) => {
  if (!req.headers.authorization) {
    return res
      .status(403)
      .json({ message: "No authorization header provided" });
  }
  if (!req.headers.authorization === AUTHORIZATION) {
    return res.status(403).json({ message: "Invalid Authorization" });
  }
  const { url, roomId, selector } = req.body;
  console.log(`scraper: ${roomId}`);
  if (!browser) {
    console.log('Creating browser');
    browser = await createBrowser();
  }
  console.log('Creating new page');
  const page = await browser.newPage();
  try {
    const data = await scraper({ page, url, roomId, selector });
    await page.close();
    console.log('Closing page')
    return res.json(data);
  } catch (error) {
    console.log(`error: ${error.message}, url: ${url}`)
    await page.close();
    return res.json({ error: { url, roomId, message: error.message } })
  }
});

const port = PORT || 5000;

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
