require('dotenv').config({ path: './.env' });
const axios = require('axios');
const mongoose = require('mongoose');
const debug = require('debug')('controller');

const DataSchema = require("./schema/data");
const ErrorSchema = require("./schema/error");

const { urls } = require('./urls.json');
const selector = require("./selectors/airbnb.json");


const argv = require('minimist')(process.argv);
const { AUTHORIZATION, MONGO_URL } = process.env;
const { start, end, api, proxies: proxiesDir } = argv;

let proxyList;

if (proxiesDir) {
  const { proxies } = require(proxiesDir);
  proxyList = proxies;
}

const runner = async () => {
  const site = 'airbnb';
  // Set index
  const startIndex = start || 0;
  const endIndex = end || urls.length;
  for (const [i, url] of urls.slice(startIndex, endIndex).entries()) {
    const roomId = url.split('/').slice(-1)[0];
    debug(`${i + 1} out of ${endIndex - startIndex}: ${roomId}`);

    const alreadyScraped = await DataSchema.findOne({ roomId });
    const existOnError = await ErrorSchema.findOne({ roomId });
    if (!alreadyScraped && !existOnError) {
      try {
        const res = await axios({
          method: 'post',
          url: api,
          headers: { authorization: AUTHORIZATION },
          data: { url, roomId, selector, proxies: proxyList }
        });
        if (res.data.error) {
          debug(`Error found on: ${roomId}`)
          const newError = new ErrorSchema({ ...res.data.error, site });
          await newError.save();
        } else {
          const newData = new DataSchema({ ...res.data, site, roomId });
          await newData.save();
        }
      } catch (error) {
        debug(`error: ${error.message}, roomId: ${roomId}`)
        throw error;
      }
    } else {
      debug(`Already scraped: ${roomId}`)
    }
  }
  debug('Complete!');
  return true;
};


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
      runner().then(() => mongoose.connection.close());
    }
  }
);

