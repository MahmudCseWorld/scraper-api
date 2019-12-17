const axios = require("axios");

const { API_URL, AUTHORIZATION } = process.env;

const runner = async () => {
  try {
    const res = await axios.get(API_URL, {
      headers: { authorization: AUTHORIZATION }
    });
    return res.data;
  } catch (error) {
    console.log({ error });
  }
};

runner().then(console.log);
