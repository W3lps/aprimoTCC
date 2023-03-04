const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
require('dotenv').config();

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const tarefasRoutes = require('./routes/sistema');

const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '/src/arquivos');
  },
  filename: (req, file, cb) => {
    uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.originalname + '-' + uniqueSuffix);
  },
});

const PORT = process.env.PORT || 3000;
const MONGODB_URI = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@aprimotcc.bqgyq0v.mongodb.net/${process.env.DB}?retryWrites=true&w=majority`;

app.use(bodyParser.json());
app.use(multer({ storage: fileStorage }).single('arquivo'));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Methods',
    'OPTIONS, GET, POST, PUT, PATCH, DELETE'
  );
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use('/admin', adminRoutes);
app.use('/auth', authRoutes);
app.use('/', tarefasRoutes);

app.use((error, _, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message, data: error });
});

mongoose
  .connect(MONGODB_URI)
  .then(result => {
    app.listen(PORT);
  })
  .catch(err => console.log(err));
