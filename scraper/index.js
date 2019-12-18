require('dotenv').config({ path: './.env' });

const express = require("express");
const bodyParser = require("body-parser");

const scraper = require("./lib/scraper");
const createBrowser = require('./lib/browser');

const { AUTHORIZATION, PORTS } = process.env;

const app = express();

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }));

app.use(async function (req, res, next) {
  const page = await createBrowser();
  req.page = page;
  next();
})

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
    const data = await scraper({ page: req.page, url, roomId, selector });
    return res.json(data);
  } catch (error) {
    return res.json({ error: { url, roomId, message: error.message } })
  }
});

app.get('/', (req, res) => res.send('Hi'));

PORTS.split(',').map(port => {
  app.listen(port, () => {
    console.log(`server is running on port ${port}`);
  });
});
