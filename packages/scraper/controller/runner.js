const puppeteer = require("puppeteer-extra");
const debug = require("debug")("scraper");
const mongoose = require("mongoose");
const scraper = require("../lib/scraper");
const DataSchema = require("../schema/data");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const runner = async ({ site, urls, start, end }) => {
  let result;
  // Set index
  const startIndex = start - 1 || 0;
  const endIndex = end || urls.length;
  const selectors = require(`./selectors/${site}.json`);

  debug("Opening browser");
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  for (const [i, url] of urls.slice(startIndex, endIndex).entries()) {
    const roomId = url.split("/").slice(-1)[0];
    debug(`${i + 1} out of ${urls.length}: ${roomId}`);
    try {
      const alreadyScraped = await DataSchema.findOne({ roomId });
      if (!alreadyScraped) {
        const data = await scraper({
          site,
          page,
          url,
          selectors
        });
        const newData = new DataSchema({ ...data, site, roomId });
        result = await newData.save();
      } else {
        debug(`${roomId} is already scraped`);
      }
    } catch (error) {
      debug(`Error found on id: ${roomId}. Saved on /data/errors.json`);
    }
  }
  debug("Closing browser");
  await browser.close();
  return result;
};

module.exports = runner;
