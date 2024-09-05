import { Ingredients } from '../../common/data/entities/ingredients/ingredients.entity.js';

export const listIngredients = (pagination = {}) => {
  const { offset, limit } = pagination;
  return Ingredients.findAll({
    offset,
    limit
  });
};
