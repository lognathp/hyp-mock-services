const { RESPONSE_DELAY_MS } = require('../config/env');

module.exports = async (req, res, next) => {
  await new Promise(resolve => setTimeout(resolve, RESPONSE_DELAY_MS));
  next();
};