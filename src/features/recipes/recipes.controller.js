import { createRecipes, getRecipeById, addRecipeToFavorites, removeRecipeFromFavorites } from './recipes.service.js';
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

export const addToFavorites = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!id) {
    return next(HttpError(400, 'Recipe ID is required'));
  }

  try {
    const result = await addRecipeToFavorites(userId, id);

    if (result.error) {
      return next(HttpError(404, result.error));
    }

    res.status(201).json(result);
  } catch (e) {
    next(e);
  }
};

export const removeFromFavorites = async (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (!id) {
    return next(HttpError(400, 'Recipe ID is required'));
  }

  try {
    const result = await removeRecipeFromFavorites(userId, id);

    if (result.error) {
      return next(HttpError(404, result.error));
    }

    res.json(result);
  } catch (e) {
    next(e);
  }
};
