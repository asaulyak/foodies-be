import { listCategories } from './categories.service.js';

export const getCategories = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const categories = await listCategories({ page, limit });
    res.json(categories);
  } catch (error) {
    next(HttpError(500));
  }
};
