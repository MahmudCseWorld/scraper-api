const express = require('express');
const cors = require('cors');
const scrapper = require('./scraper');

const app = express();
app.use(cors());

app.get('/api/scraper', async (req, res) => {
	const data = await scrapper();
	res.json(data);
});

app.listen(5000, () => {
	console.log('server is running on port 5000');
});
