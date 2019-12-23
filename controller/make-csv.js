const mongoose = require('mongoose');
const { parse } = require('json2csv');
const debug = require('debug')('make-csv');
const fs = require('fs');


const DataSchema = require("./schema/data");
const { db, scraper: { site } } = require('./config');

if (!site) {
  throw new Error('No site name provided!')
}

const fields = {
  url: "Listing URL",
  headline: "Listing Headline",
  total_review: "# Of Reviews",
  last_review_date: "Date of Last Review",
  description: "Description",
}

const writeCsv = async (data) => {
  const csv = parse(data, { fields: Object.keys(fields).map(f => fields[f]) });
  return fs.writeFile(`${__dirname}/output/${site}.csv`, csv, err => err && debug(err));
};

const removeDuplicates = (originalArray, prop) => {
  var newArray = [];
  var lookupObject = {};

  for (var i in originalArray) {
    lookupObject[originalArray[i][prop]] = originalArray[i];
  }

  for (i in lookupObject) {
    newArray.push(lookupObject[i]);
  }
  return newArray;
}

const formatData = async () => {
  let dataForCSV = [];
  try {
    const data = await DataSchema.find({});
    dataForCSV = removeDuplicates(data, 'roomId').map(r => ({ [fields.url]: r.url, [fields.headline]: r.headline, [fields.total_review]: r.total_review, [fields.last_review_date]: r.last_review_date, [fields.description]: r.description }))
  } catch (err) {
    debug(err);
  }
  return dataForCSV;
}

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
      formatData().then((d) => writeCsv(d)).then(() => mongoose.connection.close());
    }
  }
);
