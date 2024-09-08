import { HttpError } from '../../common/errors/http-error.js';
import {
  comparePassword,
  createUser,
  getUserByEmail,
  getUserById,
  listFollowers,
  listFollowing,
  updateUserById,
  updateUserAvatar,
  getDetailedInfo,
  getUserSubscription,
  addUserSubscription,
  removeUserSubscriptions,
  listFavorites,
  signIn
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

  const signInData = await signIn(user);

  res.status(201).json(signInData);
});

export const loginUser = controllerWrapper(async (req, res) => {
  const { email, password } = req.body;
  const user = await comparePassword(email, password);

  if (!user) {
    throw HttpError(401, 'Email or password is wrong');
  }

  const signInData = await signIn(user);

  return res.status(200).json(signInData);
});

export const getCurrent = controllerWrapper((req, res) => {
  const user = req.user;

  if (!user) {
    throw HttpError(500);
  }

  const { email, name, avatar } = user;

  res.json({ email, name, avatar });
});

export const getFollowers = controllerWrapper(async (req, res) => {
  const { id: currentUserId } = req.user;
  const { page, limit, offset } = req.pagination;
  const result = await listFollowers({ currentUserId, page, limit, offset });

  res.json(result);
});

export const getFollowing = controllerWrapper(async (req, res) => {
  const { id: currentUserId } = req.user;
  const { page, limit, offset } = req.pagination;
  const result = await listFollowing({ currentUserId, page, limit, offset });

  res.json(result);
});

export const signoutUser = controllerWrapper(async (req, res) => {
  const { id } = req.user;
  await updateUserById(id, { token: null });

  res.json({
    message: 'Signout success'
  });
});

export const getUserRecipes = controllerWrapper(async (req, res, next) => {
  const { id: currentUserId } = req.user;
  const { limit, offset } = req.pagination;
  const result = await listRecipes({ ownerId: currentUserId, limit, offset });

  res.json(result);
});

export const updateAvatar = controllerWrapper(async (req, res) => {
  if (!req.file) {
    throw HttpError(400, 'Missing the file to upload');
  }
  const { path } = req.file;
  const user = req.user;

  if (!user) {
    return next(HttpError(500));
  }

  const { id, avatar: existingAvatar } = user;

  const avatar = await updateUserAvatar(id, existingAvatar, path);

  return res.status(200).json({ avatar });
});

export const getInfo = controllerWrapper(async (req, res) => {
  const userId = req.user.id;
  const { id: searchId } = req.params;

  const info = await getDetailedInfo(userId, searchId);

  if (!info) {
    throw HttpError(404);
  } //user not found with searchId

  res.json(info);
});

export const subscribeToUser = controllerWrapper(async (req, res) => {
  const { id: currentUserId } = req.user;
  const { subscribedTo } = req.body;
  // Check if the current user is trying to subscribe to their own profile
  if (currentUserId === subscribedTo) {
    throw HttpError(409, 'You cannot subscribe to your own profile');
  }
  // Check if the user already exists in the system
  const userToSubscribe = await getUserById(subscribedTo);
  if (!userToSubscribe) {
    throw HttpError(404, 'User not found');
  }

  // Check if the subscription already exists
  const existingSubscription = await getUserSubscription({ currentUserId, subscribedTo });

  if (existingSubscription) {
    throw HttpError(409, 'You are already subscribed to this user');
  }

  await addUserSubscription({ currentUserId, subscribedTo });

  res.sendStatus(201);
});

export const unsubscribeFromUser = controllerWrapper(async (req, res) => {
  const { id: subscribedTo } = req.params;
  const { id: currentUserId } = req.user;
  // Check if the current user is trying to unsubscribe to their own profile
  if (currentUserId === subscribedTo) {
    throw HttpError(409, 'You cannot unsubscribe to your own profile');
  }
  // Check if the user already exists in the system
  const userToUnsubscribe = await getUserById(subscribedTo);
  if (!userToUnsubscribe) {
    throw HttpError(404, 'User not found');
  }

  // Create the subscription
  const result = await removeUserSubscriptions({ currentUserId, subscribedTo });

  // Check if the subscription already exists
  if (!result) {
    throw HttpError(409, 'You are already unsubscribed from this user');
  }

  res.sendStatus(204);
});

export const getFavorites = controllerWrapper(async (req, res) => {
  const userId = req.user.id;

  const { limit, offset } = req.pagination;
  const favorites = await listFavorites({ ownerId: userId, limit, offset });

  return res.json(favorites);
});
