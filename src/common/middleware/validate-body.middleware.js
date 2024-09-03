import { HttpError } from '../errors/http-error.js';

export const validateBodyMiddleware = schema => (req, _, next) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return next(HttpError(400, error.message));
  }
  next();
};
