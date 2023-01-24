const { celebrate, Joi } = require('celebrate');
const { ObjectId } = require('mongoose').Types;
const { REGEX_FOR_URL } = require('../utils/constants');

const validateGetUserById = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Невалидный _id пользователя.');
    }),
  }),
});

const validateCreateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom((value, helpers) => {
      if (REGEX_FOR_URL.test(value)) {
        return value;
      }
      return helpers.message({ message: 'Невалидный url для аватара.' });
    }),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateUpdateUserProfile = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const validateUpdateUserAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom((value, helpers) => {
      if (REGEX_FOR_URL.test(value)) {
        return value;
      }
      return helpers.message({ message: 'Невалидный url для аватара.' });
    }),
  }),
});

const validateLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
});

const validateCreateCard = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().custom((value, helpers) => {
      if (REGEX_FOR_URL.test(value)) {
        return value;
      }
      return helpers.message({ message: 'Невалидный url для изображения карточки.' });
    }),
  }),
});

const validateCardId = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required().custom((value, helpers) => {
      if (ObjectId.isValid(value)) {
        return value;
      }
      return helpers.message('Невалидный _id карточки.');
    }),
  }),
});

module.exports = {
  validateGetUserById,
  validateCreateUser,
  validateUpdateUserProfile,
  validateUpdateUserAvatar,
  validateLogin,
  validateCreateCard,
  validateCardId,
};
