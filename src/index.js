const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const adminRoutes = require('./routes/admin');
const authRoutes = require('./routes/auth');
const systemRoutes = require('./routes/system');

const app = express();

const MONGODB_URL =
  'mongodb+srv://read_write_only:js2020@aprimotcc.bqgyq0v.mongodb.net/aprimoTCC?retryWrites=true&w=majority';

app.use(bodyParser.json());

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
app.use('/', systemRoutes);

app.use((error, req, res) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(MONGODB_URL)
  .then(result => {
    app.listen(3030);
  })
  .catch(err => console.log(err));
