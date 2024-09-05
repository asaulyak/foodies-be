import {
  createRecipes,
  getRecipeById,
  getPopularRecipes,
  getRecipesByFilter,
  removeRecipe
} from './recipes.service.js';
import { HttpError } from '../../common/errors/http-error.js';
<<<<<<< HEAD
import { fn } from 'sequelize';
import { controllerWrapper } from '../../common/decorators/controller-wrapper.js';
=======
>>>>>>> d7dcd95 (added recipes search (#56))

export const getById = controllerWrapper(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw HttpError(404);
  }

  const recipe = await getRecipeById(id);

  if (!recipe) {
    throw HttpError(404);
  }

  res.json(recipe);
});

export const createRecipe = controllerWrapper(async (req, res) => {
  const user = req.user;
  const newRecipe = await createRecipes({ ...req.body, ownerId: user.id });

  if (!newRecipe) {
    throw HttpError(500);
  }
  res.status(201).json(newRecipe);
});

<<<<<<< HEAD
export const getPopular = controllerWrapper(async (req, res) => {
  const popularRecipes = await getPopularRecipes();
  return res.json(popularRecipes);
});
=======
export const searchRecipes = async (req, res) => {
  const { categoryId, areaId, ingredientIds } = req.query;
  const { limit, offset } = req.pagination;

  const recipes = await getRecipesByFilter({ categoryId, areaId, ingredientIds, limit, offset });

  res.json(recipes);
};

export const getPopular = async (req, res, next) => {
  try {
    const popularRecipes = await getPopularRecipes();
    return res.json(popularRecipes);
  } catch (e) {
    next(e);
  }
};
export const deleteRecipe = async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(HttpError(404));
  }
  try {
    const result = await removeRecipe(id);
    if (!result) {
      return next(HttpError(404));
    }
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};
>>>>>>> d7dcd95 (added recipes search (#56))
