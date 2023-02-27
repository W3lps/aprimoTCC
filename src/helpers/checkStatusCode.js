module.exports = (err, next) => {
  err.statusCode ? err.statusCode : (err.statusCode = 500);
  next(err);
};
