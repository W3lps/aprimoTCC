const excelJS = require('exceljs');

const Grupo = require('../models/grupo');
const User = require('../models/usuario');
const Tarefa = require('../models/tarefa');

const checkStatusCode = require('../helpers/checkStatusCode');
const errorHandler = require('../helpers/errorHandler');
const inputValidator = require('../helpers/inputValidator');

const checkAuthLevel = async usertipo =>
  usertipo !== 'professor' ? errorHandler(401, 'Usuário não autorizado') : '';

exports.criarGrupoPage = async (req, res, next) => {
  checkAuthLevel(req.userTipo);
  inputValidator({ req: req });
  //envia os alunos para o professor selecionar no front
  try {
    const user = await User.find(req.userId);
    const alunos = await User.find({
      curso: user.curso,
      turma: req.body.turma,
    });
    res.status(200).json({ alunos: alunos });
  } catch (err) {
    checkStatusCode(err, next);
  }
};

exports.criarGrupo = async (req, res, next) => {
  checkAuthLevel(req.userTipo);
  inputValidator({ req: req });
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

exports.verGruposPage = async (req, res, next) => {
  checkAuthLevel(req.userTipo);
  try {
    const user = await User.findById(req.userId);
    const grupos = await Grupo.find({ curso: user.curso }).populate('membros');
    res.status(200).json({ grupos: grupos });
  } catch (err) {
    checkStatusCode(err, next);
  }
};

exports.verDetalhesGrupoPage = async (req, res, next) => {
  checkAuthLevel(req.userTipo);
  try {
    const grupo = Grupo.find({ _id: req.params.groupId }).populate('membros');
    if (!grupo) errorHandler(404, 'Não foi possível localizar o grupo!');
    const tarefas = Tarefa.find({ groupId: grupo._id }).populate('criadoPor');
    res.status(200).json({ grupo: grupo, tarefas: tarefas });
  } catch (err) {
    checkStatusCode(err, next);
  }
};

exports.gerarPlanilhaGrupo = async (req, res, next) => {
  checkAuthLevel(req.userTipo);
  try {
    //montando a estrutura da planilha
    const workbook = new excelJS.Workbook();
    const worksheet = workbook.addWorksheet('tarefas-do-grupo');
    worksheet.columns = [
      { header: 'Titulo', key: 'titulo', width: 25 },
      { header: 'Status', key: 'statusConclusao', width: 12 },
      { header: 'Curso', key: 'curso', width: 25 },
      { header: 'Turma', key: 'turma', width: 12 },
      { header: 'Descrição', key: 'descricao', width: 25 },
      { header: 'Matéria', key: 'materia', width: 20 },
      { header: 'Dificuldade', key: 'dificuldadeAoRealizar', width: 15 },
      { header: 'Observacoes', key: 'observacaoRealizacao', width: 25 },
      { header: 'Data de criacao', key: 'criadoEm', width: 12 },
    ];
    const tarefas = await Tarefa.find(
      { groupId: req.params.groupId },
      'titulo statusConclusao curso turma descricao materia dificuldadeAoRealizar observacaoRealizacao criadoEm'
    );
    //adicionando os dados a planilha
    tarefas.map(tarefa => {
      worksheet.addRow(tarefa);
    });
    //retorna a planilha montada
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheatml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="tarefas` + `_` + req.params.groupId + `.xlsx`
    );
    res.status(200);
    return await workbook.xlsx.write(res);
  } catch (err) {
    checkStatusCode(err, next);
  }
};
