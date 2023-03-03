const express = require('express');
const { body } = require('express-validator/check');

const router = express.Router();

const adminController = require('../controllers/admin');
const isAuth = require('../helpers/is-auth');

router.post(
  '/adicionar-grupo',
  isAuth,
  [body('turma').not().isEmpty()],
  adminController.criarGrupoPage
);

router.put(
  '/adicionar-grupo',
  isAuth,
  [
    body('tema').not().isEmpty(),
    body('descricao').not().isEmpty(),
    body('curso').not().isEmpty(),
    body('turma').not().isEmpty(),
    body('membros').not().isEmpty(),
  ],
  adminController.criarGrupo
);

router.get('/ver-grupos', isAuth, adminController.verGruposPage);

router.get(
  '/detalhes-grupo/:groupId',
  isAuth,
  adminController.verDetalhesGrupoPage
);

router.get(
  '/gerar-planilha/:groupId',
  isAuth,
  adminController.gerarPlanilhaGrupo
);

module.exports = router;
