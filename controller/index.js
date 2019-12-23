const axios = require('axios');
const mongoose = require('mongoose');
const debug = require('debug')('controller');

const { auth, db, scraper: { urlsDir, proxiesDir, site, start, end, api } } = require('./config');
const DataSchema = require("./schema/data");
const ErrorSchema = require("./schema/error");

let proxyList;

if (!site) {
  throw new Error('No site name provided!')
}

if (!urlsDir) {
  throw new Error('No urls directory provided!')
}

if (proxiesDir) {
  const { proxies } = require(proxiesDir);
  proxyList = proxies;
}



const runner = async () => {
  const { urls } = require(urlsDir);
  const selector = require(`./selectors/${site}.json`);
  // Set index
  const startIndex = start || 0;
  const endIndex = end || urls.length;
  for (const [i, url] of urls.slice(startIndex, endIndex).entries()) {
    // Unique id for single url
    const roomId = url.split('/').slice(-1)[0];
    debug(`${i + 1} out of ${endIndex - startIndex}`);
    // Make sure to skip already skipped and errors
    const alreadyScraped = await DataSchema.findOne({ roomId });
    const existOnError = await ErrorSchema.findOne({ roomId });
    if (!alreadyScraped && !existOnError) {
      try {
        const res = await axios({
          method: 'post',
          url: api,
          headers: { authorization: auth.token },
          timeout: 2 * 60000,
          data: { url, roomId, selector, proxies: proxyList }
        });
        debug(`Complete scraping ${roomId}`);
        if (res.data.error) {
          debug(`Error found on: ${roomId}`)
          const newError = new ErrorSchema({ ...res.data.error, site });
          await newError.save();
        } else {
          const newData = new DataSchema({ ...res.data, site, roomId, url });
          await newData.save();
        }
      } catch (error) {
        debug(`error: ${error.message}, roomId: ${roomId}`)
      }
    } else {
      debug(`Already scraped: ${roomId}`)
    }
  }
  return true;
};


mongoose.connect(
  db.url,
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

