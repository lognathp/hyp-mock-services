let requestCount = 0;

module.exports = (req, res, next) => {
  requestCount++;
  req.requestCount = requestCount;
  next();
};