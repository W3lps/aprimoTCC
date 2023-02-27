const jwt = require('jsonwebtoken');
const errorHandler = require('../helpers/errorHandler');

module.exports = (req, _, next) => {
  const authStatus = req.get('Authorization');
  if (!authStatus) errorHandler(401, 'Você não realizou o login!');
  const token = authStatus.split(' ')[1];
  let decodedToken;
  try {
    decodedToken = jwt.verify(token, 'hashedSecret=WP');
  } catch (err) {
    errorHandler(500, 'A autenticação falhou!');
  }
  if (!decodedToken) errorHandler(401, 'Não autenticado!');
  req.userId = decodedToken.userId;
  next();
};
