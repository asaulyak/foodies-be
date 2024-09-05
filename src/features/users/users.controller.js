import { HttpError } from '../../common/errors/http-error.js';
import {
  comparePassword,
  createUser,
  getUserByEmail,
  updateUserById,
  listFollowers,
  listFollowing
} from './users.service.js';
import { signToken } from '../../common/auth/auth.service.js';

export const registerUser = async (req, res, next) => {
  const { email, password, name } = req.body;

  try {
    const existingUser = await getUserByEmail(email);

    if (existingUser) {
      return next(HttpError(409, 'Email in use'));
    }

    const user = await createUser({ email, password, name });

    // TODO: Add more user fields if needed
    res.status(201).json({
      user: {
        email,
        name: user.name
      }
    });
  } catch (e) {
    next(e);
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await comparePassword(email, password);

    if (!user) {
      return next(HttpError(401, 'Email or password is wrong'));
    }

    // TODO: Extend user fields if needed
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
  } catch (e) {
    next(HttpError(401, 'Email or password is wrong'));
  }
};

export const getCurrent = async (req, res, next) => {
  try {
    const user = req.user;

    if (!user) {
      return next(HttpError(500));
    }

    const { email, name } = user;

    res.json({ email, name });
  } catch (e) {
    next(e);
  }
};

export const getFollowers = async (req, res, next) => {
  try {
    const { id: currentUserId } = req.user;
    const { page, limit, offset } = req.pagination;
    const result = await listFollowers({ currentUserId }, { page, limit, offset });

    res.json(result);
  } catch (e) {
    next(e);
  }
};

export const getFollowing = async (req, res, next) => {
  try {
    const { id: currentUserId } = req.user;
    const { page, limit, offset } = req.pagination;
    const result = await listFollowing({ currentUserId }, { page, limit, offset });

    res.json(result);
  } catch (e) {
    next(e);
  }
};
