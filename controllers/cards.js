const mongoose = require('mongoose');
const { NotFoundError } = require('../errors/not-found-error');
const { BadRequestError } = require('../errors/bad-request-error');
const { ForbiddenError } = require('../errors/forbidden-error');
const Card = require('../models/card');
const { OK } = require('../utils/constants');

const getCards = (req, res, next) => {
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
      res.status(OK).send(cardsFormatted);
    })
    .catch(next);
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(OK).send({
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
        next(new BadRequestError('Переданы некорректные данные при создании карточки.'));
      }
      else {
        next(err);
      }
    });
};

const deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Карточка с указанным _id не найдена.');
      }

      if (req.user._id !== card.owner.toString()) {
        return Promise.reject(new ForbiddenError('Удаление чужой карточки запрещено.'));
      }

      card.delete();

      return res.status(OK).send({
        name: card.name,
        link: card.link,
        likes: card.likes,
        owner: card.owner,
        createdAt: card.createdAt,
        _id: card._id,
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadRequestError('Переданы некорректные данные для удаления карточки.'));
      }
      else {
        next(err);
      }
    });
};

const likeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $addToSet: { likes: req.user._id } },
  { new: true },
).then((card) => {
  if (!card) {
    throw new NotFoundError('Карточка с указанным _id не найдена.');
  }

  res.status(OK).send({
    name: card.name,
    link: card.link,
    likes: card.likes,
    owner: card.owner,
    createdAt: card.createdAt,
    _id: card._id,
  });
}).catch((err) => {
  if (err instanceof mongoose.Error.CastError) {
    next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка.'));
  }
  else {
    next(err);
  }
});

const dislikeCard = (req, res, next) => Card.findByIdAndUpdate(
  req.params.cardId,
  { $pull: { likes: req.user._id } },
  { new: true },
).then((card) => {
  if (!card) {
    throw new NotFoundError('Карточка с указанным _id не найдена.');
  }

  res.status(OK).send({
    name: card.name,
    link: card.link,
    likes: card.likes,
    owner: card.owner,
    createdAt: card.createdAt,
    _id: card._id,
  });
}).catch((err) => {
  if (err instanceof mongoose.Error.CastError) {
    next(new BadRequestError('Переданы некорректные данные для постановки/снятии лайка.'));
  }
  else {
    next(err);
  }
});

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
