require("dotenv").config({ path: "../../.env" });
const axios = require("axios");
const argv = require("minimist")(process.argv);
const { API_URL, AUTHORIZATION } = process.env;
const { site, urls: urlsDir, start, end, proxies: proxiesDir } = argv;

if (!site) {
  throw new Error("No site provided to scrape");
}

if (!urlsDir) {
  throw new Error("No urls provided to scrape.");
}
const runner = async () => {
  const { urls } = require(urlsDir);
  const { proxies } = require(proxiesDir);
  try {
    const res = await axios({
      method: "post",
      url: API_URL,
      headers: { authorization: AUTHORIZATION },
      data: { site, urls, start, end, proxies }
    });
    return res.data;
  } catch (error) {
    console.log({ error: error.message });
  }
};

runner().then(console.log);
