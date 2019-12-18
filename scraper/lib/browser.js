const puppeteer = require('puppeteer-extra');
// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');

const getProxy = require('../lib/random-proxy');

const createBrowser = async (proxies) => {
  puppeteer.use(StealthPlugin());
  const args = ['--no-sandbox', '--disable-setuid-sandbox'];
  if (proxies) {
    const proxy = await getProxy(proxies);
    args.push(`--proxy-server=${proxy}`)
  }
  const browser = await puppeteer.launch({
    headless: false,
    args
  });
  return browser;
}

module.exports = createBrowser;