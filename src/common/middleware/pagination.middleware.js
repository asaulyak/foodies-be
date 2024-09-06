import { HttpError } from '../errors/http-error.js';

export const paginationMiddleware = (req, res, next) => {
  const { page = 1, limit = 10 } = req.query;

  const pageClean = Number(page);
  const limitClean = Number(limit);

  if (isNaN(pageClean) || isNaN(limitClean) || pageClean < 0 || limitClean < 0) {
    return next(HttpError(422, 'Invalid page or limit'));
  }

  const offset = (pageClean - 1) * limitClean;

  if (offset < 0) {
    return next(HttpError(422, 'Invalid page or limit'));
  }

  req.pagination = {
    page: pageClean,
    limit: limitClean,
    offset
  };

  next();
};
