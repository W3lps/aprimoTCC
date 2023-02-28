const errorHandler = require('./errorHandler');

module.exports = async usertipo => {
  if (usertipo !== 'professor') errorHandler(401, 'Não autorizado');
};
