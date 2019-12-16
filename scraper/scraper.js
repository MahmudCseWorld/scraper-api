const puppeteer = require("puppeteer-extra");
// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

const scraper = async () => {
  console.log("Opening browser");
  const browser = await puppeteer.launch({
    headless: false,
    // important for running on various server where root user is present
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });
  try {
    const page = await browser.newPage();
    console.log("Navigating");
    await page.goto("https://example.com");

    const result = await page.evaluate(() => {
      return {
        header: document.querySelector("h1").innerText,
        title: document.querySelector("div p").innerText
      };
    });
    console.log("Closing browser");
    return result;
  } catch (error) {
    console.log(error);
  }
  await browser.close();
};

module.exports = scraper;
