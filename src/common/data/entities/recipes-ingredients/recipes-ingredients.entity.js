import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../sequelize.js';
import { Recipes } from '../recipes/recipes.entity.js';
import { Ingredients } from '../ingredients/ingredients.entity.js';

export class RecipeIngredients extends Model {}

RecipeIngredients.init(
  {
    recipeId: {
      type: DataTypes.UUID,
      references: {
        model: Recipes,
        key: 'id'
      },
      primaryKey: true
    },
    ingredientId: {
      type: DataTypes.UUID,
      references: {
        model: Ingredients,
        key: 'id'
      },
      primaryKey: true
    }
  },
  { sequelize, modelName: 'recipeIngredients' }
);
