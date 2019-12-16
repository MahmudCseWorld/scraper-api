const axios = require("axios");

const runner = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/scraper");
    return res.data;
  } catch (error) {
    console.log({ error });
  }
};

runner().then(console.log);

