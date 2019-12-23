require('dotenv').config();

const argv = require('minimist')(process.argv);
const { AUTHORIZATION, MONGO_URL } = process.env;

module.exports = {
  auth: { token: AUTHORIZATION },
  db: { url: MONGO_URL },
  scraper: argv,
}