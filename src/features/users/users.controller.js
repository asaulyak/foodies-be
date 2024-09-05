import { HttpError } from '../../common/errors/http-error.js';
import {
  comparePassword,
  createUser,
  getUserByEmail,
  listFollowers,
  listFollowing,
  updateUserById,
  getDetailedInfo
} from './users.service.js';
import { controllerWrapper } from '../../common/decorators/controller-wrapper.js';
import { signToken } from '../../common/auth/auth.service.js';
import { listRecipes } from '../recipes/recipes.service.js';

export const registerUser = controllerWrapper(async (req, res) => {
  const { email, password, name } = req.body;
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    throw HttpError(409, 'Email in use');
  }

  const user = await createUser({ email, password, name });

  res.status(201).json({
    user: {
      email,
      name: user.name
    }
  });
});

export const loginUser = controllerWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await comparePassword(email, password);

  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const userData = {
    name: user.name,
    email: user.email,
    id: user.id
  };

  const token = signToken(userData);

  await updateUserById(user.id, {
    token
  });

  return res.status(200).json({
    token,
    user: userData
  });
});

export const getCurrent = controllerWrapper((req, res) => {
  const user = req.user;

  if (!user) {
    throw HttpError(500);
  }

  const { email, name } = user;

  res.json({ email, name });
});

export const getFollowers = controllerWrapper(async (req, res) => {
  const { id: currentUserId } = req.user;
  const { page, limit, offset } = req.pagination;
  const result = await listFollowers({ currentUserId }, { page, limit, offset });

  res.json(result);
});

export const getFollowing = controllerWrapper(async (req, res) => {
  const { id: currentUserId } = req.user;
  const { page, limit, offset } = req.pagination;
  const result = await listFollowing({ currentUserId }, { page, limit, offset });

  res.json(result);
});

export const getRecipes = controllerWrapper(async (req, res, next) => {
  const { id: currentUserId } = req.user;
  const { page, limit, offset } = req.pagination;
  const result = await listRecipes({ ownerId: currentUserId }, { page, limit, offset });

  res.json(result);
});

export const getInfo = controllerWrapper(async (req, res) => {
  const { id } = req.params;
  const result = await getDetailedInfo(id);

  res.json(result);
});
