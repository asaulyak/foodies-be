import { createRecipes, getPopularRecipes, getRecipeById } from './recipes.service.js';
import { HttpError } from '../../common/errors/http-error.js';
import { fn } from 'sequelize';

export const getById = async (req, res, next) => {
  const { id } = req.params;

  if (!id) {
    return next(HttpError(404));
  }

  try {
    const recipe = await getRecipeById(id);

    if (!recipe) {
      return next(HttpError(404));
    }

    res.json(recipe);
  } catch (e) {
    next(e);
  }
};

export const createRecipe = async (req, res, next) => {
  try {
    const user = req.user;
    const newRecipe = await createRecipes({ ...req.body, ownerId: user.id });

    if (!newRecipe) {
      return next(HttpError(500));
    }
    res.status(201).json(newRecipe);
  } catch (e) {
    next(e);
  }
};

export const getPopular = async (req, res, next) => {
  try {
    const popularRecipes = await getPopularRecipes();
    return res.json(popularRecipes);
  } catch (e) {
    next(e);
  }
};
