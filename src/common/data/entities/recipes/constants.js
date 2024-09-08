import { Sequelize } from 'sequelize';
import { Ingredients } from '../ingredients/ingredients.entity.js';
import { Categories } from '../category/categories.entity.js';
import { Areas } from '../areas/areas.entity.js';
import { Users } from '../users/users.entity.js';

export const commonRecipeInclude = [
  {
    model: Ingredients,
    attributes: [
      'id',
      'name',
      'image',
      'description',
      [
        Sequelize.literal(`(SELECT "quantity" FROM "recipeIngredients"
                          WHERE "recipeIngredients"."ingredientId" = "ingredients"."id"
                          AND "recipeIngredients"."recipeId" = "recipes"."id")`),
        'quantity'
      ]
    ],
    through: { attributes: [] }
  },
  {
    model: Categories
  },
  {
    model: Areas
  },
  {
    model: Users,
    attributes: ['id', 'name', 'avatar']
  }
];
