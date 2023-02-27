const User = require('../models/usuario');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const errorHandler = require('../helpers/errorHandler');
const catchError = require('../helpers/checkStatusCode');

exports.cadastro = async (req, res) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const user = new User({
    email: req.body.email,
    senha: hashedPassword,
  });
  user.save();
  console.log('done', user);
};

exports.login = async (req, res, next) => {
  const email = req.body.email;
  const senha = req.body.password;
  let enteredUser;
  try {
    const user = await User.findOne({ email: email });
    if (!user) errorHandler(401, 'Usuário não encontrado!');
    const doMatch = await bcrypt.compare(senha, user.senha);
    if (!doMatch) errorHandler(401, 'Senha inválida!');
    enteredUser = user;
    const jwtToken = jwt.sign(
      { email: enteredUser.email, userId: enteredUser._id },
      'hashedSecret=WP',
      { expiresIn: '1h' }
    );
    res
      .status(200)
      .json({ token: jwtToken, userId: enteredUser._id.toString() });
  } catch (err) {
    catchError(err, next);
  }
};
