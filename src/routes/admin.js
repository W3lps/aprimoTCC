const express = require('express');

const router = express.Router();

const adminController = require('../controllers/admin');
const isAuth = require('../helpers/is-auth');

router.post('/create-group', isAuth, adminController.criarGrupo);

module.exports = router;
