const NodeGeocoder = require("node-geocoder");

const options = {
  provider: process.env.NODE_GEOCODER_PROVIDER,
  apiKey: process.env.NODE_GEOCODER_API_KEY,
  formatter: null,
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
