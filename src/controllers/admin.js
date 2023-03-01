const { validationResult } = require('express-validator/check');

const Grupo = require('../models/grupo');
const User = require('../models/usuario');

const checkStatusCode = require('../helpers/checkStatusCode');
const errorHandler = require('../helpers/errorHandler');
const checkAuthLevel = require('../helpers/checkAuthLevel');

exports.criarGrupo = async (req, res, next) => {
  checkAuthLevel(req.userTipo);
  if (!validationResult(req).isEmpty())
    errorHandler(422, 'Dados incorretos! Reveja os inputs');
  if (req.body.membros.length < 3)
    errorHandler(422, 'O grupo é pequeno demais');
  membrosId = req.body.membros;
  const grupo = new Grupo({
    tema: req.body.tema,
    descricao: req.body.descricao,
    curso: req.body.curso,
    turma: req.body.turma,
    membros: membrosId,
  });
  try {
    await grupo.save();
    membrosId.map(async membroId => {
      const membro = await User.findById(membroId);
      membro.grupo = grupo._id;
      await membro.save();
    });
    res.status(201).json({ message: 'Grupo criado com sucesso' });
  } catch (err) {
    checkStatusCode(err, next);
  }
};

exports.verGrupos = async (req, res, next) => {
  checkAuthLevel(req.userTipo);
  try {
    const user = await User.findById(req.userId);
    const grupos = await Grupo.find({ curso: user.curso }).populate('membros');
    res.status(200).json({ grupos: grupos });
  } catch (err) {
    checkStatusCode(err, next);
  }
};
