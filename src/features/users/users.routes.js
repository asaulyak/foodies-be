import express from 'express';
import { userRegisterSchema } from './schemas/user-register.schema.js';
import {
  getCurrent,
  loginUser,
  registerUser,
  getFollowers,
  getFollowing,
  updateAvatar,
  signoutUser,
  getUserRecipes,
  getInfo,
  subscribeToUser,
  unsubscribeFromUser,
  getFavorites
} from './users.controller.js';
import { validateBodyMiddleware } from '../../common/middleware/validate-body.middleware.js';
import { userLoginSchema } from './schemas/user-login.schema.js';
import { authMiddleware } from '../../common/middleware/auth.middleware.js';
import { paginationMiddleware } from '../../common/middleware/pagination.middleware.js';
import { upload } from '../../common/middleware/upload.middleware.js';
import { userSubscribeSchema } from './schemas/user-subscribe.schema.js';

const uploadAvatarMiddleware = upload.single('avatar');

export const userRouter = express.Router();

userRouter.get('/favorites', authMiddleware, paginationMiddleware, getFavorites);
userRouter.post('/signup', validateBodyMiddleware(userRegisterSchema), registerUser);
userRouter.post('/signin', validateBodyMiddleware(userLoginSchema), loginUser);
userRouter.post('/signout', authMiddleware, signoutUser);
userRouter.get('/current', authMiddleware, getCurrent);
userRouter.get('/followers', authMiddleware, paginationMiddleware, getFollowers);
userRouter.get('/following', authMiddleware, paginationMiddleware, getFollowing);
userRouter.get('/recipes', authMiddleware, paginationMiddleware, getUserRecipes);
userRouter.patch('/avatar', authMiddleware, uploadAvatarMiddleware, updateAvatar);
userRouter.get('/info/:id', authMiddleware, getInfo);
userRouter.post('/subscribe', authMiddleware, validateBodyMiddleware(userSubscribeSchema), subscribeToUser);
userRouter.delete('/unsubscribe/:id', authMiddleware, unsubscribeFromUser);
