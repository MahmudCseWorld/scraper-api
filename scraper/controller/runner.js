const mongoose = require('mongoose');
const browserPagePool = require('./browserPagePool');
const scraper = require('../lib/scraper');
const DataSchema = require('../schema/data');
const ErrorSchema = require('../schema/error');

const runner = async ({ site, urls, start, end, proxies }) => {
	let result;
	// Set index
	const startIndex = start - 1 || 0;
	const endIndex = end || urls.length;
	const selectors = require(`./selectors/${site}.json`);

	const page = await browserPagePool.acquire();

	for (const [ i, url ] of urls.slice(startIndex, endIndex).entries()) {
		const roomId = url.split('/').slice(-1)[0];
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
	console.log('Release the page');
	await browserPagePool.release(page);
	return result;
};

module.exports = runner;
