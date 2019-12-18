require('dotenv').config({ path: '../../.env' });
const axios = require('axios');
const mongoose = require('mongoose');

const DataSchema = require("./schema/data");
const ErrorSchema = require("./schema/error");
const argv = require('minimist')(process.argv);
const { API_URL, AUTHORIZATION } = process.env;
const { start, end } = argv;


mongoose.connect(
	MONGO_URL,
	{
		useUnifiedTopology: true,
		useNewUrlParser: true
	},
	(err) => {
		if (err) {
			console.log(err);
		} else {
			console.log('DB is running');
		}
	}
);

const runner = async () => {
	const { urls } = require('./urls.json');
	const { proxies } = require('./proxies.json');

	for (const [ i, url ] of urls.entries()) {
		const roomId = url.split('/').slice(-1)[0];
		console.log(`${i + 1} out of ${urls.length}: ${roomId}`);

		const alreadyScraped = await DataSchema.findOne({ roomId });
		if (!alreadyScraped) {
			const res = await axios({
				method: 'post',
				url: API_URL,
				headers: { authorization: AUTHORIZATION },
				data: {  url,  proxies }
      });
      const newData = new DataSchema(res.data);
		} else {
			console.log(`${roomId} is already scraped`);
		}
	}
};

runner().then(console.log);
