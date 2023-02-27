const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const grupoSchema = new Schema({
  tema: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
  },
  curso: {
    type: String,
    required: true,
  },
  turma: {
    type: String,
    required: true,
  },
  membros: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

module.exports = mongoose.model('Grupo', grupoSchema);
