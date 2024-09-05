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

export const addRecipeToFavorites = async (userId, id) => {
  const user = await Users.findByPk(userId);
  if (!user) {
    return { error: 'User not found' };
  }

  const recipe = await Recipes.findByPk(id);
  if (!recipe) {
    return { error: 'Recipe not found' };
  }

  try {
    const favorite = await UserFavorites.create({
      ownerId: userId,
      recipeId: id
    });
    return favorite;
  } catch (error) {
    return { error: error.message };
  }
};

export const removeRecipeFromFavorites = async (userId, recipeId) => {
  try {
    const result = await UserFavorites.destroy({
      where: {
        ownerId: userId,
        recipeId: recipeId
      }
    });

    if (result === 0) {
      return { error: 'Favorite entry not found' };
    }

    return { message: 'Recipe removed from favorites' };
  } catch (error) {
    return { error: error.message };
  }
};
