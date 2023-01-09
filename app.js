const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const app = express();
const { NOT_FOUND } = require('./utils/constants');

// При записи адреса как localhost возникала ошибка.
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.user = {
    _id: '63ab2a53bab19685b5864fb6',
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use('/', (req, res) => res.status(NOT_FOUND).send({ message: 'Страница не найдена.' }));

app.listen(3000);
