const User = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const errorHandler = require('../helpers/errorHandler');
const catchError = require('../helpers/checkStatusCode');

exports.cadastrar = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.senha, 12);
  const user = new User({
    nome: req.body.nome,
    email: req.body.email,
    senha: hashedPassword,
    curso: req.body.curso,
    turma: req.body.turma,
    tipo: req.body.tipo,
  });
  user.save();
  res.status(201).json({ message: 'Created', user });
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const senha = req.body.senha;
  let enteredUser;
  try {
    const user = await User.findOne({ email: email });
    if (!user) errorHandler(401, 'Usuário não encontrado!');
    const doMatch = await bcrypt.compare(senha, user.senha);
    if (!doMatch) errorHandler(401, 'Senha inválida!');
    enteredUser = user;
    const jwtToken = jwt.sign(
      {
        email: enteredUser.email,
        userId: enteredUser._id,
        userTipo: enteredUser.tipo.toString(),
      },
      'hashedSecret=WP'
      // { expiresIn: '1h' }
    );
    res.status(200).json({
      token: jwtToken,
      userId: enteredUser._id,
    });
  } catch (err) {
    catchError(err, next);
  }
};
