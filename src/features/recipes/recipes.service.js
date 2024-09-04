import { Recipes } from '../../common/data/entities/recipes/recipes.entity.js';
import { Ingredients } from '../../common/data/entities/ingredients/ingredients.entity.js';
import { Categories } from '../../common/data/entities/category/categories.entity.js';
import { Areas } from '../../common/data/entities/areas/areas.entity.js';
import { Users } from '../../common/data/entities/users/users.entity.js';
import { UserFavorites } from '../../common/data/entities/users-favorites/users-favorites.entity.js';
import { sequelize } from '../../common/data/sequelize.js';

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

export const createRecipes = async body => {
  return Recipes.create(body);
};

export const getPopularRecipes = async () => {
  const res = (
    await UserFavorites.findAll({
      attributes: ['recipeId', [sequelize.fn('COUNT', sequelize.col('userFavorites.ownerId')), 'appearance']],
      group: ['userFavorites.recipeId', 'recipe.id'],
      order: [[sequelize.fn('count', sequelize.col('userFavorites.ownerId')), 'DESC']],
      include: [
        {
          model: Recipes
        }
      ],
      limit: 4
    })
  ).map(({ recipe }) => recipe);

  return res;
};
