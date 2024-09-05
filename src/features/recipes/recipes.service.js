import { Recipes } from '../../common/data/entities/recipes/recipes.entity.js';
import { Ingredients } from '../../common/data/entities/ingredients/ingredients.entity.js';
import { Categories } from '../../common/data/entities/category/categories.entity.js';
import { Areas } from '../../common/data/entities/areas/areas.entity.js';
import { Users } from '../../common/data/entities/users/users.entity.js';
import { UserFavorites } from '../../common/data/entities/userFavorites/userFavorites.entity.js';

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
