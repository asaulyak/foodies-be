import { listCategories } from './categories.service.js';

export const getCategories = async (_, res) => {
  try {
    const categories = await listCategories();
    res.json(categories);
  } catch (error) {
    next(HttpError(500));
  }
};
