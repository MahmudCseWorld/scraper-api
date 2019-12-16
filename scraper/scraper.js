const puppeteer = require('puppeteer-extra');
// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const scraper = async () => {
	const browser = await puppeteer.launch({
		// will greatly affect the results
		headless: true,
		// important for running on various server where root user is present
		args: [ '--no-sandbox', '--disable-setuid-sandbox' ]
	});
	const page = await browser.newPage();
	await page.goto('https://example.com');

	const result = await page.evaluate(() => {
		return {
			header: document.querySelector('h1').innerText,
			title: document.querySelector('div p').innerText
		};
	});
	await browser.close();
	return result;
};

module.exports = scraper;
