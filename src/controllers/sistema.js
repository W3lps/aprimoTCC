const { validationResult } = require('express-validator/check');

const Tarefa = require('../models/tarefa');
const User = require('../models/usuario');
const Grupo = require('../models/grupo');

const checkSatusCode = require('../helpers/checkStatusCode');
const errorHandler = require('../helpers/errorHandler');

exports.verTarefas = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);
    const tarefas = await Tarefa.find(
      user.tipo === 'aluno' ? { groupId: user.grupo } : { curso: user.curso }
    )
      .populate('criadoPor')
      .populate('groupId');
    res.status(200).json({ tarefas: tarefas });
  } catch (err) {
    checkSatusCode(err, next);
  }
};

exports.criarTarefa = async (req, res, next) => {
  if (!validationResult(req).isEmpty())
    errorHandler(422, 'Dados incorretos! Reveja as informações inseridas');
  try {
    const user = await User.findById(req.userId);
    let groupId;
    user.tipo === 'aluno'
      ? (groupId = user.grupo)
      : (groupId = await Grupo.find(
          { curso: user.curso, turma: req.body.turma },
          '_id'
        ));
    const tarefa = new Tarefa({
      titulo: req.body.titulo,
      curso: user.curso,
      turma: user.turma,
      descricao: req.body.descricao,
      materia: req.body.materia,
      criadoPor: user._id,
      groupId: groupId,
    });
    await tarefa.save();
    res.status(201).json({ message: 'Tarefa adicionada', tarefa: tarefa._id });
  } catch (err) {
    checkSatusCode(err, next);
  }
};

exports.atualizarGrupo = async (req, res, next) => {
  if (!validationResult(req).isEmpty())
    errorHandler(422, 'Dados incorretos! Reveja as informações inseridas');
  if (req.userTipo !== 'aluno') errorHandler(401, 'Usuário não autorizado');
  const grupo = await Grupo.findById(req.params.groupId);
  const user = await User.findById(req.userId);
  if (user.grupo.toString() !== grupo._id.toString())
    errorHandler(401, 'Usuário não autorizado');
  grupo.tema = req.body.novoTema;
  grupo.descricao = req.body.novaDescricao;
  await grupo.save();
  return res.status(200).json({ message: 'Grupo atualizado!' });
};
