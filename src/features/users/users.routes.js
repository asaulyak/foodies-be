import express from 'express';
import { userRegisterSchema } from './schemas/user-register.schema.js';
import { loginUser, me, registerUser } from './users.controller.js';
import { validateBodyMiddleware } from '../../common/middleware/validate-body.middleware.js';
import { userLoginSchema } from './schemas/user-login.schema.js';
import { authMiddleware } from '../../common/middleware/auth.middleware.js';

export const userRouter = express.Router();

userRouter.post('/signup', validateBodyMiddleware(userRegisterSchema), registerUser);
userRouter.post('/signin', validateBodyMiddleware(userLoginSchema), loginUser);
userRouter.get('/me', authMiddleware, me);
