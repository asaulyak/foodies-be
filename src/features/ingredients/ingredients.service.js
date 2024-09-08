import { Ingredients } from '../../common/data/entities/ingredients/ingredients.entity.js';
import { paginationWrapper } from '../../common/data/pagination.wrapper.js';

export const listIngredients = (pagination = {}) => {
  const { offset, limit, page } = pagination;
  return paginationWrapper(() => Ingredients, {
    offset,
    limit,
    page
  });
};
