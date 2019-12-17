const puppeteer = require("puppeteer-extra");
// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const scraper = async () => {
  console.log("Opening browser");
  let result;
  const browser = await puppeteer.launch({
    headless: false,
    // important for running on various server where root user is present
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  try {
    const page = await browser.newPage();
    console.log("Navigating");
    await page.goto("https://example.com");

    result = await page.evaluate(() => {
      return {
        header: document.querySelector("h1").innerText,
        title: document.querySelector("div p").innerText
      };
    });
  } catch (error) {
    console.log(error);
  }
  console.log("Closing browser");
  await browser.close();
  return result;
};

module.exports = scraper;
