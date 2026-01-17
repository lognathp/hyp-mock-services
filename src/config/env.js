module.exports = {
  PORT: process.env.PORT || 8090,
  RESPONSE_DELAY_MS: parseInt(process.env.RESPONSE_DELAY_MS || '50', 10)
};