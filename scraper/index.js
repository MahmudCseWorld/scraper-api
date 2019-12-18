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
  try {
    if (!browser) {
      browser = await createBrowser();
    }
    const page = await browser.newPage();
    console.log(`${roomId}`)
    const data = await scraper({ page, url, roomId, selector });
    await page.close();
    return res.json(data);
  } catch (error) {
    console.log(`error: ${error.message}, url: ${url}`)
    return res.json({ error: { url, roomId, message: error.message } })
  }
});

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
