const path = require('path');
const fs = require('fs');

const Tarefa = require('../models/tarefa');
const User = require('../models/usuario');
const Grupo = require('../models/grupo');

const checkSatusCode = require('../helpers/checkStatusCode');
const errorHandler = require('../helpers/errorHandler');
const inputValidator = require('../helpers/inputValidator');

const checkAluno = function (usertipo) {
  if (usertipo !== 'aluno') return errorHandler(401, 'Usuário não autorizado');
};

const excluirArquivo = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};

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
  inputValidator({ req: req });
  try {
    const user = await User.findById(req.userId);
    let groupId = [];
    user.tipo === 'aluno'
      ? groupId.push(user.grupo)
      : (groupId = await Grupo.find(
          { curso: user.curso, turma: req.body.turma },
          '_id'
        ));
    groupId.map(async grupo => {
      const tarefa = new Tarefa({
        titulo: req.body.titulo,
        curso: user.curso,
        turma: user.turma,
        descricao: req.body.descricao,
        materia: req.body.materia,
        criadoPor: user._id,
        groupId: grupo,
      });
      await tarefa.save();
    });

    res.status(201).json({ message: 'Tarefa adicionada', tarefa: 'funfa' });
  } catch (err) {
    checkSatusCode(err, next);
  }
};

exports.finalizarTarefa = async (req, res, next) => {
  inputValidator({ req: req });
  try {
    const user = await User.findById(req.userId);
    const tarefa = await Tarefa.findById(req.params.tafId);
    if (!tarefa) errorHandler(404, 'Tarefa não encontrada!');
    if (user.grupo.toString() !== tarefa.groupId.toString())
      errorHandler(401, 'Usuário não autorizado');
    tarefa.statusConclusao = 'concluida';
    tarefa.diculdadeAoRealizar = req.body.dificuldade;
    tarefa.observacaoRealizacao = req.body.observacoes;
    tarefa.fileUrl = req.file ? req.file.path : null;
    await tarefa.save();
    res.status(200).json({ message: 'Tarefa finalizada!', tarefa: tarefa });
  } catch (err) {
    checkSatusCode(err, next);
  }
};

exports.editarTarefaPage = async (req, res, next) => {
  try {
    const tarefa = await Tarefa.findById({ _id: req.params.tafId }).populate(
      'groupId'
    );
    if (!tarefa) errorHandler(404, 'Não foi possível localizar a tarefa');
    if (tarefa.criadoPor !== req.userId)
      errorHandler(401, 'Usuário não autorizado');
    res.status(200).json({ tarefa: tarefa });
  } catch (err) {
    checkSatusCode(err, next);
  }
};

exports.editarTarefa = async (req, res, next) => {
  inputValidator({ req: req });
  try {
    const tarefa = await Tarefa.findById(req.params.tafId);
    if (!tarefa) errorHandler(404, 'Não foi possível localizar a tarefa!');
    if (tarefa.criadoPor !== req.userId)
      errorHandler(401, 'Usuário não autorizado');
    if (tarefa.statusConclusao === 'concluida')
      errorHandler(401, 'A tarefa já foi finalizada!');
    const arquivo = req.file.path || tarefa.arquivoUrl;
    if (arquivo !== tarefa.arquivoUrl) excluirArquivo(tarefa.arquivoUrl);
    tarefa.titulo = req.body.novoTitulo;
    tarefa.descricao = req.body.novaDescricao;
    tarefa.materia = req.body.novaMateria;
    tarefa.arquivoUrl = arquivo;
    await tarefa.save();
    res.status(200).json({ message: 'Tarefa atualizada!' });
  } catch (err) {
    checkSatusCode(err, next);
  }
};

exports.detalhesTarefaPage = async (req, res, next) => {
  try {
    const tarefa = await Tarefa.findById(req.params.tafId);
    if (!tarefa) errorHandler(404, 'Não foi possível localizar a tarefa!');
    res.status(200).json({ tarefa: tarefa });
  } catch (err) {
    checkSatusCode(err, next);
  }
};

exports.excluirTarefa = async (req, res, next) => {
  try {
    const tarefa = await Tarefa.findById(req.params.tafId);
    if (!tarefa) errorHandler(404, 'Não foi possível localizar a tarefa!');
    if (req.userId !== tarefa.criadoPor.toString())
      errorHandler(401, 'Não autorizado');
    if (tarefa.arquivoUrl) excluirArquivo(tarefa.arquivoUrl);
    await Tarefa.findByIdAndRemove(tarefa._id);
    res.status(200).json({ message: 'Tarefa excluída!' });
  } catch (err) {
    checkSatusCode(err, next);
  }
};

exports.atualizarGrupo = async (req, res, next) => {
  checkAluno(req.userTipo);
  inputValidator({ req: req });
  try {
    const grupo = await Grupo.findById(req.params.groupId);
    if (!grupo) errorHandler(404, 'Não foi possível localizar o grupo!');
    const user = await User.findById(req.userId);
    if (user.grupo.toString() !== grupo._id.toString())
      errorHandler(401, 'Usuário não autorizado');
    grupo.tema = req.body.novoTema;
    grupo.descricao = req.body.novaDescricao;
    await grupo.save();
    return res.status(200).json({ message: 'Grupo atualizado!' });
  } catch (err) {
    checkSatusCode(err, next);
  }
};
