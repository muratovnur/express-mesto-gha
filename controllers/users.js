const mongoose = require('mongoose');
const User = require('../models/user');

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send(users))
    .catch(() => {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      res.status(200).send({
        name: user.name, about: user.about, avatar: user.avatar, _id: user._id,
      });
    })
    .catch((err) => {
      // Если пользователь не найден user.name вызовет ошибку TypeError,
      // поскольку user будет undefined
      if (err instanceof TypeError || err instanceof mongoose.Error.CastError) {
        res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send({
        name: user.name, about: user.about, avatar: user.avatar, _id: user._id,
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
        return;
      }
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const updateUserProfile = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { ...req.body },
    { new: true },
  ).then((user) => {
    res.status(200).send({
      name: user.name, about: user.about, avatar: user.avatar, _id: user._id,
    });
  }).catch((err) => {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      return;
    }

    if (err instanceof TypeError || err instanceof mongoose.Error.CastError) {
      res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      return;
    }

    res.status(500).send({ message: 'На сервере произошла ошибка' });
  });
};

const updateUserAvatar = async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { avatar: req.body.avatar },
    { new: true },
  ).then((user) => {
    res.status(200).send({
      name: user.name, about: user.about, avatar: user.avatar, _id: user._id,
    });
  }).catch((err) => {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).send({ message: 'Переданы некорректные данные при создании пользователя.' });
      return;
    }

    if (err instanceof TypeError || err instanceof mongoose.Error.CastError) {
      res.status(404).send({ message: 'Пользователь по указанному _id не найден.' });
      return;
    }

    res.status(500).send({ message: 'На сервере произошла ошибка' });
  });
};

module.exports = {
  getUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
};