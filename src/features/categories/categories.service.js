import { Categories } from '../../common/data/entities/category/categories.entity.js';

export const listCategories = (pagination = {}) => {
  const { page = 1, limit = 11 } = pagination;

  const normalizedLimit = Number(limit);
  const offset = (Number(page) - 1) * normalizedLimit;
  return Categories.findAll({
    offset,
    limit: normalizedLimit
  });
};
