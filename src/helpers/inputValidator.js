const { validationResult } = require('express-validator/check');
const errorHandler = require('../helpers/errorHandler');
module.exports = ({ req }) => {
  if (!validationResult(req).isEmpty())
    errorHandler(422, 'Dados incorretos! Reveja os inputs');
};
