require('dotenv').config();

const mongoose = require('mongoose');
const { parse } = require('json2csv');
const debug = require('debug')('make-csv');
const fs = require('fs');

const DataSchema = require("./schema/data");

const { MONGO_URL } = process.env;

const fields = {
  url: "Listing URL",
  headline: "Listing Headline",
  total_review: "# Of Reviews",
  last_review_date: "Date of Last Review",
  description: "Description",
}

const writeCsv = async (data) => {
  const csv = parse(data, { fields: Object.keys(fields).map(f => fields[f]) });
  return fs.writeFile(`${__dirname}/data/firms.csv`, csv, err => err && debug(err));
};

const formatData = async () => {
  const opts = { fields };
  let dataForCSV = [];
  try {
    const data = await DataSchema.find({});
    dataForCSV = data.map(r => ({ [fields.url]: r.url, [fields.headline]: r.headline, [fields.total_review]: r.total_review, [fields.last_review_date]: r.last_review_date, [fields.description]: r.description }))
  } catch (err) {
    debug(err);
  }
  return dataForCSV;
}

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
      formatData().then((d) => writeCsv(d)).then(() => mongoose.connection.close());
    }
  }
);
