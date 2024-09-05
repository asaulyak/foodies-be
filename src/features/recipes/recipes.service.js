import { Recipes } from '../../common/data/entities/recipes/recipes.entity.js';
import { Ingredients } from '../../common/data/entities/ingredients/ingredients.entity.js';
import { Categories } from '../../common/data/entities/category/categories.entity.js';
import { Areas } from '../../common/data/entities/areas/areas.entity.js';
import { Users } from '../../common/data/entities/users/users.entity.js';
import { UserFavorites } from '../../common/data/entities/users-favorites/users-favorites.entity.js';
import { sequelize } from '../../common/data/sequelize.js';
import { RecipeIngredients } from '../../common/data/entities/recipes-ingredients/recipes-ingredients.entity.js';

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

export const getRecipesByFilter = (filter = {}) => {
  const { categoryId, areaId, ingredientIds, limit, offset } = filter;

  const include = [];

  if (categoryId) {
    include.push({
      model: Categories,
      where: {
        id: categoryId
      }
    });
  }

  if (areaId) {
    include.push({
      model: Areas,
      where: {
        id: areaId
      }
    });
  }

  if (ingredientIds?.length) {
    include.push({
      model: Ingredients,
      through: {
        model: RecipeIngredients,
        attributes: []
      },
      where: {
        id: ingredientIds
      }
    });
  }

  return Recipes.findAll({
    include,
    limit,
    offset
  });
};

export const getPopularRecipes = async () => {
  const res = (
    await UserFavorites.findAll({
      attributes: ['recipeId', [sequelize.fn('COUNT', sequelize.col('userFavorites.ownerId')), 'appearance']],
      group: ['userFavorites.recipeId', 'recipe.id'],
      order: [[sequelize.fn('count', sequelize.col('userFavorites.ownerId')), 'DESC']],
      include: [
        {
          model: Recipes,
          as: 'recipe'
        }
      ],
      limit: 4
    })
  ).map(({ recipe }) => recipe);

  return res;
};
