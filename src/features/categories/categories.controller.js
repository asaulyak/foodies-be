import { listCategories } from './categories.service.js';
import { HttpError } from '../../common/errors/http-error.js';
import { controllerWrapper } from '../../common/decorators/controller-wrapper.js';

export const getCategories = controllerWrapper(async (req, res) => {
  const { limit, offset, page } = req.pagination;

  const categories = await listCategories({ offset, limit, page });
  if (!categories) {
    throw HttpError(500);
  }

  res.json(categories);
});
