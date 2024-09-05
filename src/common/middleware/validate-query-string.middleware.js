import { HttpError } from '../errors/http-error.js';

export const validateQueryStringMiddleware = schema => (req, _, next) => {
  const { error } = schema.validate(req.query);
  if (error) {
    return next(HttpError(422, error.message));
  }
  next();
};
