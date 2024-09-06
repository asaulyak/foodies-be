import { Recipes } from '../../common/data/entities/recipes/recipes.entity.js';
import { Ingredients } from '../../common/data/entities/ingredients/ingredients.entity.js';
import { Categories } from '../../common/data/entities/category/categories.entity.js';
import { Areas } from '../../common/data/entities/areas/areas.entity.js';
import { RecipeIngredients } from '../../common/data/entities/recipes-ingredients/recipes-ingredients.entity.js';
import { Users } from '../../common/data/entities/users/users.entity.js';
import { UserFavorites } from '../../common/data/entities/users-favorites/users-favorites.entity.js';
import { sequelize } from '../../common/data/sequelize.js';

export const listRecipes = async ({ ownerId, limit, offset }) => {
  return Recipes.findAll({
    where: {
      ownerId
    },
    include: [
      {
        model: Ingredients,
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
    ],
    limit,
    offset
  });
};

export const getRecipeById = async id => {
  return Recipes.findOne({
    where: {
      id
    },
    include: [
      {
        model: Ingredients,
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
    ]
  });
};

export const createRecipes = async ({ ingredients, ...recipeBody }) => {
  const transaction = await sequelize.transaction();
  try {
    const recipe = await Recipes.create(recipeBody, { transaction });
    const ingredientsStored = await Ingredients.findAll({
      where: {
        id: ingredients
      }
    });

    await Promise.all(ingredientsStored.map(ingredient => recipe.addIngredient(ingredient, { transaction })));

    await transaction.commit();

    return getRecipeById(recipe.id);
  } catch (e) {
    await transaction.rollback();
    throw e;
  }
};

export const addRecipeToFavorites = async (userId, recipeId) => {
  return UserFavorites.create({
    ownerId: userId,
    recipeId: recipeId
  });
};

export const recipeExists = async id => {
  const recipe = await Recipes.findByPk(id);
  return !!recipe;
};

export const isRecipeFavorite = async (userId, recipeId) => {
  const favorite = await UserFavorites.findOne({
    where: {
      ownerId: userId,
      recipeId: recipeId
    }
  });
  return !!favorite;
};

export const removeRecipeFromFavorites = async (userId, recipeId) => {
  return UserFavorites.destroy({
    where: {
      ownerId: userId,
      recipeId: recipeId
    }
  });
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

export const removeRecipe = async id => {
  await RecipeIngredients.destroy({
    where: {
      recipeId: id
    }
  });
  await UserFavorites.destroy({
    where: {
      recipeId: id
    }
  });
  return Recipes.destroy({
    where: {
      id
    }
  });
};
