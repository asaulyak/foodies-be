import { listCategories } from './categories.service.js';
import { HttpError } from '../../common/errors/http-error.js';

export const getCategories = async (req, res, next) => {
  try {
    const { limit, offset } = req.pagination;
    const categories = await listCategories({ offset, limit });
    res.json(categories);
  } catch (error) {
    next(HttpError(500));
  }
};
