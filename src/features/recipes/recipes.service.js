import { Recipes } from '../../common/data/entities/recipes/recipes.entity.js';
import { RecipeIngredients } from '../../common/data/entities/recipes-ingredients/recipes-ingredients.entity.js';
import { UserFavorites } from '../../common/data/entities/users-favorites/users-favorites.entity.js';
import { sequelize } from '../../common/data/sequelize.js';
import { commonRecipeInclude } from '../../common/data/entities/recipes/constants.js';
import { paginationWrapper } from '../../common/data/pagination.wrapper.js';

export const listRecipes = async ({ ownerId, limit, offset, page }) => {
  return paginationWrapper(() => Recipes, {
    where: {
      ownerId
    },
    include: commonRecipeInclude,
    limit,
    offset,
    page
  });
};

export const getRecipeById = async id => {
  return Recipes.findOne({
    where: {
      id
    },
    include: commonRecipeInclude
  });
};

export const createRecipes = async ({ ingredients, ...recipeBody }) => {
  const transaction = await sequelize.transaction();
  try {
    const recipe = await Recipes.create(recipeBody, { transaction });

    await Promise.all(
      ingredients.map(async ingredient => {
        await RecipeIngredients.create(
          {
            recipeId: recipe.id,
            ingredientId: ingredient.id,
            quantity: ingredient.quantity
          },
          { transaction }
        );
      })
    );

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

export const getRecipesByFilter = async (filter = {}) => {
  const { categoryId, areaId, ingredientIds, limit, offset, page } = filter;

  const where = {};

  if (categoryId) {
    where.categoryId = categoryId;
  }

  if (areaId) {
    where.areaId = areaId;
  }

  if (ingredientIds?.length) {
    const recipeIds = (
      await RecipeIngredients.findAll({
        where: {
          ingredientId: ingredientIds
        }
      })
    ).map(item => item.recipeId);

    where.id = recipeIds;
  }

  return paginationWrapper(() => Recipes, {
    include: commonRecipeInclude,
    where,
    limit,
    offset,
    page
  });
};

export const getPopularRecipes = async () => {
  const favoriteRecipes = await UserFavorites.findAll({
    attributes: ['recipeId', [sequelize.fn('count', sequelize.col('ownerId')), 'count']],
    group: ['recipeId'],
    order: [[sequelize.fn('count', sequelize.col('ownerId')), 'DESC']],
    limit: 4
  });

  const recipeIds = favoriteRecipes.map(record => record.recipeId);

  return Recipes.findAll({
    where: {
      id: recipeIds
    },
    include: commonRecipeInclude
  });
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
