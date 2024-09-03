import { HttpError } from '../errors/http-error.js';
import { verifyToken } from '../auth/auth.service.js';
import { getUserByEmail } from '../../features/users/users.service.js';

const authError = HttpError(401, 'Not authorized');

export const authMiddleware = async (req, res, next) => {
  const [_, token] = req.headers.authorization?.split(' ') || [];

  if (!token) {
    return next(authError);
  }

  try {
    const payload = verifyToken(token);

    if (!payload?.email) {
      return next(authError);
    }

    const user = await getUserByEmail(payload.email);

    if (user?.token !== token) {
      return next(authError);
    }

    req.user = user;
    next();
  } catch (e) {
    next(authError);
  }
};
