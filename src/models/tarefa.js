const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tarefaSchema = new Schema({});

module.exports = mongoose.model('Tarefa', tarefaSchema);
