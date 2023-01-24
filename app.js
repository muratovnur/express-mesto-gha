const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const { login, createUser } = require('./controllers/users');
const { validateCreateUser, validateLogin } = require('./middlewares/validations');
const { jwtVerify } = require('./middlewares/auth');
const { NOT_FOUND } = require('./utils/constants');

const app = express();

// При записи адреса как localhost возникала ошибка.
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.use(cookieParser());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/signin', validateLogin, login);
app.post('/signup', validateCreateUser, createUser);

app.use(jwtVerify);

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use('/', (req, res) => res.status(NOT_FOUND).send({ message: 'Страница не найдена.', params: req.params }));

app.use(errors());

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(3000);
