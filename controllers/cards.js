const mongoose = require('mongoose');
const Card = require('../models/card');

const getCards = (req, res) => {
  Card.find({})
    .then((cards) => {
      const cardsFormatted = cards.map((card) => ({
        name: card.name,
        link: card.link,
        likes: card.likes,
        owner: card.owner,
        createdAt: card.createdAt,
        _id: card._id,
      }));
      res.status(200).send(cardsFormatted);
    })
    .catch(() => {
      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.send({
        name: card.name,
        link: card.link,
        likes: card.likes,
        owner: card.owner,
        createdAt: card.createdAt,
        _id: card._id,
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(400).send({ message: 'Переданы некорректные данные при создании карточки.' });
        return;
      }

      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const deleteCard = async (req, res) => {
  await Card.findByIdAndDelete(req.params.cardId)
    .then((card) => {
      res.send({
        name: card.name,
        link: card.link,
        likes: card.likes,
        owner: card.owner,
        createdAt: card.createdAt,
        _id: card._id,
      });
    })
    .catch((err) => {
      if (err instanceof TypeError || err instanceof mongoose.Error.CastError) {
        res.status(404).send({ message: 'Карточка с указанным _id не найдена.' });
        return;
      }

      res.status(500).send({ message: 'На сервере произошла ошибка' });
    });
};

const likeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
).then((card) => {
  res.send({
    name: card.name,
    link: card.link,
    likes: card.likes,
    owner: card.owner,
    createdAt: card.createdAt,
    _id: card._id,
  });
}).catch((err) => {
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
    return;
  }

  if (err instanceof TypeError || err instanceof mongoose.Error.CastError) {
    res.status(400).send({ message: 'Передан несуществующий _id карточки.' });
    return;
  }

  res.status(500).send({ message: 'На сервере произошла ошибка' });
});

const dislikeCard = (req, res) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
).then((card) => {
  res.send({
    name: card.name,
    link: card.link,
    likes: card.likes,
    owner: card.owner,
    createdAt: card.createdAt,
    _id: card._id,
  });
}).catch((err) => {
  if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).send({ message: 'Переданы некорректные данные для постановки/снятии лайка.' });
    return;
  }

  if (err instanceof TypeError || err instanceof mongoose.Error.CastError) {
    res.status(400).send({ message: 'Передан несуществующий _id карточки.' });
    return;
  }

  res.status(500).send({ message: 'На сервере произошла ошибка' });
});

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
