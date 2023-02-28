const express = require('express');

const router = express.Router();

const tarefaController = require('../controllers/tarefa');
const isAuth = require('../helpers/is-auth');

router.get('/ver-tarefas', isAuth, tarefaController.verTarefas);

router.put('/adicionar-tarefa', isAuth, tarefaController.criarTarefa);

module.exports = router;
