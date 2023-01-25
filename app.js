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
const { handleErrors } = require('./middlewares/error-handler');
const { NotFoundError } = require('./errors/not-found-error');

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

app.use('/', (req, res, next) => next(new NotFoundError('По указанному пути ничего не найдено.')));

app.use(errors());

app.use(handleErrors);

app.listen(3000);
