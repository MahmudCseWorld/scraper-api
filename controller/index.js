require('dotenv').config({ path: '../.env' });
const axios = require('axios');
const mongoose = require('mongoose');
const debug = require('debug')('controller');

const DataSchema = require("./schema/data");
const ErrorSchema = require("./schema/error");

const { urls } = require('./urls.json');
const selector = require("./selectors/airbnb.json");


const argv = require('minimist')(process.argv);
const { AUTHORIZATION, MONGO_URL } = process.env;
const { start, end, api } = argv;

mongoose.connect(
  MONGO_URL,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true
  },
  (err) => {
    if (err) {
      debug(err);
    } else {
      debug('DB is running');
    }
  }
);

const runner = async () => {
  const site = 'airbnb';
  // Set index
  const startIndex = start - 1 || 0;
  const endIndex = end || urls.length;

  for (const [i, url] of urls.slice(startIndex, endIndex).entries()) {
    const roomId = url.split('/').slice(-1)[0];
    debug(`${i + 1} out of ${urls.length}: ${roomId}`);

    const alreadyScraped = await DataSchema.findOne({ roomId });
    if (!alreadyScraped) {
      const res = await axios({
        method: 'post',
        url: api,
        headers: { authorization: AUTHORIZATION },
        data: { url, roomId, selector }
      });
      if (res.data.error) {
        const newError = new ErrorSchema({ ...res.data.error, site });
        await newError.save();
      } else {
        const newData = new DataSchema({ ...res.data, site });
        await newData.save();
      }
    }
  }
  debug('Url scraped');
  return true;
};

runner();
