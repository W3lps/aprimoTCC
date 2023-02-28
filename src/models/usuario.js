const mongoose = require('mongoose');
const errorHandler = require('../helpers/errorHandler');
const checkStatusCode = require('../helpers/checkStatusCode');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  nome: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    required: true,
  },
  senha: {
    type: String,
    required: true,
  },
  curso: {
    type: String,
    // required: true,
  },
  turma: {
    type: String,
    // required: true,
  },
  tipo: {
    type: String,
    // required: true,
  },
  grupo: {
    type: Schema.Types.ObjectId,
    ref: 'Grupo',
  },
});

module.exports = mongoose.model('Usuario', userSchema);
