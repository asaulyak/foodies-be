import { Ingredients } from '../../common/data/entities/ingredients/ingredients.entity.js';

export const listIngredients = () => {
  return Ingredients.findAll();
};
