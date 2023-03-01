const express = require('express');
const { body } = require('express-validator/check');

const router = express.Router();

const sistemaController = require('../controllers/sistema');
const isAuth = require('../helpers/is-auth');

router.get('/ver-tarefas', isAuth, sistemaController.verTarefas);

router.put(
  '/adicionar-tarefa',
  [
    body('titulo').trim().isLength({ min: 3 }),
    body('descricao').trim().isLength({ min: 10 }),
    body('materia').not().isEmpty(),
  ],
  isAuth,
  sistemaController.criarTarefa
);

router.put(
  '/atualizar-grupo/:groupId',
  isAuth,
  [
    body('novoTema').trim().isLength({ min: 5 }),
    body('novaDescricao').trim().isLength({ min: 10 }),
  ],
  sistemaController.atualizarGrupo
);

module.exports = router;
