const mongoose = require('mongoose');
const User = require('../models/user');
const {
  OK, INVALID_DATA, NOT_FOUND, BAD_SERVER_DEFAULT,
} = require('../utils/constants');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      const usersFormatted = users.map((user) => ({
        name: user.name, about: user.about, avatar: user.avatar, _id: user._id,
      }));
      res.status(OK).send(usersFormatted);
    })
    .catch(() => {
      res.status(BAD_SERVER_DEFAULT).send({ message: 'На сервере произошла ошибка' });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      res.status(OK).send({
        name: user.name, about: user.about, avatar: user.avatar, _id: user._id,
      });
    })
    .catch((err) => {
      // Если передан некорректный _id произойдет CastError перед пойском пользователя
      if (err instanceof mongoose.Error.CastError) {
        res.status(INVALID_DATA).send({ message: 'Передан некорректный _id пользователя.' });
      }
      // Если пользователь не найден user.name вызовет ошибку TypeError,
      // поскольку user будет null
      else if (err instanceof TypeError) {
        res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
      }
      else {
        res.status(BAD_SERVER_DEFAULT).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(OK).send({
        name: user.name, about: user.about, avatar: user.avatar, _id: user._id,
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(INVALID_DATA).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      }
      else {
        res.status(BAD_SERVER_DEFAULT).send({ message: 'На сервере произошла ошибка' });
      }
    });
};

const updateUserProfile = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { ...req.body },
    { new: true, runValidators: true },
  ).then((user) => {
    res.status(OK).send({
      name: user.name, about: user.about, avatar: user.avatar, _id: user._id,
    });
  }).catch((err) => {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(INVALID_DATA).send({ message: 'Переданы некорректные данные при обновлении профиля.' });
    }
    else if (err instanceof TypeError || err instanceof mongoose.Error.CastError) {
      res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
    }
    else {
      res.status(BAD_SERVER_DEFAULT).send({ message: 'На сервере произошла ошибка' });
    }
  });
};

const updateUserAvatar = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true, runValidators: true },
  ).then((user) => {
    res.status(OK).send({
      name: user.name, about: user.about, avatar: user.avatar, _id: user._id,
    });
  }).catch((err) => {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(INVALID_DATA).send({ message: 'Переданы некорректные данные при обновлений аватара' });
    }
    else if (err instanceof TypeError || err instanceof mongoose.Error.CastError) {
      res.status(NOT_FOUND).send({ message: 'Пользователь по указанному _id не найден.' });
    }
    else {
      res.status(BAD_SERVER_DEFAULT).send({ message: 'На сервере произошла ошибка' });
    }
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};
