import { Recipes } from '../../common/data/entities/recipes/recipes.entity.js';
import { Ingredients } from '../../common/data/entities/ingredients/ingredients.entity.js';
import { Categories } from '../../common/data/entities/category/categories.entity.js';
import { Areas } from '../../common/data/entities/areas/areas.entity.js';
import { Users } from '../../common/data/entities/users/users.entity.js';
import { UserFavorites } from '../../common/data/entities/user-favorites/users-favorites.entity.js';
import { sequelize } from '../../common/data/sequelize.js';
import { sql, Op } from '@sequelize/core';

export const getRecipeById = async id => {
  return Recipes.findOne({
    where: {
      id
    },
    include: [
      {
        model: Ingredients,
        through: { attributes: [] } // This excludes the RecipeIngredient attributes
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
    ]
  });
};

export const getPopularRecipes = async () => {
  const res = await UserFavorites.findAll({
    include: [{ model: Recipes, attributes: ['id'] }],
    attributes: ['recipeId'],
    group: ['recipeId'],
    order: [[sequelize.fn('count', sequelize.col('ownerId')), 'DESC']],
    raw: true,
    limit: 4
  });
  return res;
};
