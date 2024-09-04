import { HttpError } from '../../common/errors/http-error.js';
import { comparePassword, createUser, getUserByEmail, updateUserById } from './users.service.js';
import { sighToken } from '../../common/auth/auth.service.js';
import ctrlWrapper from '../../common/decorators/ctrlWrapper.js';

export const registerUser = ctrlWrapper(async (req, res, next) => {
  const { email, password, name } = req.body;
  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    throw HttpError(409, 'Email in use');
  }

  const user = await createUser({ email, password, name });

  // TODO: Add more user fields if needed
  res.status(201).json({
    user: {
      email,
      name: user.name
    }
  });
});

export const loginUser = ctrlWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await comparePassword(email, password);

  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }

  // TODO: Extend user fields if needed
  const userData = {
    name: user.name,
    email: user.email,
    id: user.id
  };

  const token = sighToken(userData);

  await updateUserById(user.id, {
    token
  });

  return res.status(200).json({
    token,
    user: userData
  });
});

export const getCurrent = ctrlWrapper((req, res) => {
  const user = req.user;

  if (!user) {
    return next(HttpError(500));
  }

  const { email, name } = user;

  res.json({ email, name });
});
