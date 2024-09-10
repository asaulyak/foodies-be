import { Categories } from '../../common/data/entities/category/categories.entity.js';

export const listCategories = () => {
  return Categories.findAll();
};
