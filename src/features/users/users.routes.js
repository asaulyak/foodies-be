import express from 'express';
import { userRegisterSchema } from './schemas/user-register.schema.js';
import {
  getCurrent,
  loginUser,
  registerUser,
  getFollowers,
  getFollowing,
  signoutUser,
  getRecipes
} from './users.controller.js';

import { validateBodyMiddleware } from '../../common/middleware/validate-body.middleware.js';
import { userLoginSchema } from './schemas/user-login.schema.js';
import { authMiddleware } from '../../common/middleware/auth.middleware.js';
import { paginationMiddleware } from '../../common/middleware/pagination.middleware.js';

export const userRouter = express.Router();

userRouter.post('/signup', validateBodyMiddleware(userRegisterSchema), registerUser);
userRouter.post('/signin', validateBodyMiddleware(userLoginSchema), loginUser);
userRouter.get('/current', authMiddleware, getCurrent);
userRouter.get('/followers', authMiddleware, paginationMiddleware, getFollowers);
userRouter.get('/following', authMiddleware, paginationMiddleware, getFollowing);
userRouter.get('/recipes', authMiddleware, paginationMiddleware, getRecipes);
userRouter.post('/signout', authMiddleware, signoutUser);
