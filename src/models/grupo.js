const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const grupoSchema = new Schema({});

module.exports = mongoose.model('Grupo', grupoSchema);
