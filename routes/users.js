const usersRouter = require('express').Router();
const {
  validateGetUserById, validateUpdateUserProfile, validateUpdateUserAvatar,
} = require('../middlewares/validations');
const {
  getUsers, getUserById, getUserInfo, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/me', getUserInfo);
usersRouter.get('/:userId', validateGetUserById, getUserById);

usersRouter.patch('/me', validateUpdateUserProfile, updateUserProfile);
usersRouter.patch('/me/avatar', validateUpdateUserAvatar, updateUserAvatar);

module.exports = usersRouter;
