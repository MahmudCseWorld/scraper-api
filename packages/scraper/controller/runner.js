const puppeteer = require("puppeteer-extra");
const mongoose = require("mongoose");

const scraper = require("../lib/scraper");
const getProxy = require("../lib/random-proxy");

const DataSchema = require("../schema/data");
const ErrorSchema = require("../schema/error");

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const runner = async ({ site, urls, start, end, proxies }) => {
  let result;
  // Set index
  const startIndex = start - 1 || 0;
  const endIndex = end || urls.length;
  const selectors = require(`./selectors/${site}.json`);

  console.log("Opening browser");
  const proxy = await getProxy(proxies);
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      `--proxy-server=${proxy}`
    ]
  });
  const page = await browser.newPage();

  for (const [i, url] of urls.slice(startIndex, endIndex).entries()) {
    const roomId = url.split("/").slice(-1)[0];
    console.log(`${i + 1} out of ${urls.length}: ${roomId}`);
    try {
      const alreadyScraped = await DataSchema.findOne({ roomId });
      if (!alreadyScraped) {
        const data = await scraper({
          site,
          page,
          url,
          selectors
        });
        const newData = new DataSchema({ ...data, site, roomId, url });
        result = await newData.save();
      } else {
        console.log(`${roomId} is already scraped`);
      }
    } catch (error) {
      const newError = new ErrorSchema({
        site,
        roomId,
        url,
        message: error.message
      });
      await newError.save();
      console.log(`Error found on id: ${roomId}`);
    }
  }
  console.log("Closing browser");
  await browser.close();
  return result;
};

module.exports = runner;
