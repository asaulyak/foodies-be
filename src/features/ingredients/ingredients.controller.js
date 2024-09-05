import { listIngredients } from './ingredients.service.js';
import { HttpError } from '../../common/errors/http-error.js';

export const getIngredients = async (req, res, next) => {
  try {
    const { limit, offset } = req.pagination;
    const ingredients = await listIngredients({ offset, limit });
    res.json(ingredients);
  } catch (error) {
    next(HttpError(500));
  }
};
