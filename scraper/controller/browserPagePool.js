const genericPool = require('generic-pool');
const puppeteer = require('puppeteer-extra');
const getProxy = require('../lib/random-proxy');

// add stealth plugin and use defaults (all evasion techniques)
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const factory = {
	create: async function() {
		console.log('Opening browser');
		const proxy = await getProxy(proxies);
		const browser = await puppeteer.launch({
			headless: false,
			args: [ '--no-sandbox', '--disable-setuid-sandbox', `--proxy-server=${proxy}` ]
		});
		const page = await browser.newPage();
		return page;
	},
	destroy: function(puppeteer) {
		puppeteer.close();
	}
};

const browserPagePool = genericPool.createPool(factory, {
	max: 5,
	min: 1,
	maxWaitingClients: 5
});

module.exports = browserPagePool;
