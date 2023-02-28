const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tarefaSchema = new Schema({
  titulo: {
    type: String,
    required: true,
  },
  curso: {
    type: String,
    required: true,
  },
  turma: {
    type: String,
    required: true,
  },
  descricao: {
    type: String,
    required: true,
  },
  materia: {
    type: String,
    required: true,
  },
  statusConclusao: {
    type: String,
  },
  diculdadeAoRealizar: {
    type: String,
  },
  observacaoRealizacao: {
    type: String,
  },
  fileUrl: {
    type: String,
  },
  groupId: [
    {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Grupo',
    },
  ],
  criadoPor: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Usuario',
  },
  criadoEm: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Tarefa', tarefaSchema);
