import { Categories } from '../../common/data/entities/category/categories.entity.js';

export const listCategories = (pagination = {}) => {
  const { offset, limit } = pagination;

  return Categories.findAll({
    offset,
    limit
  });
};
