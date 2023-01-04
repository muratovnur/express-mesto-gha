const usersRouter = require('express').Router();
const {
  getUsers, getUserById, createUser, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');

usersRouter.get('/', getUsers);
usersRouter.get('/:userId', getUserById);

usersRouter.post('/', createUser);

usersRouter.patch('/me', updateUserProfile);
usersRouter.patch('/me/avatar', updateUserAvatar);

module.exports = usersRouter;
