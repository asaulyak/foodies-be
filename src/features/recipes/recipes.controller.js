import { getRecipeById } from './recipes.service.js';
import { HttpError } from '../../common/errors/http-error.js';

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

export const createRecipes = async (req, res, next) => {
  const { name, description, image } = req.body;
  if (!name || !description || !image) {
    return next(HttpError(404));
  }
  try {
    const newRecipe = await createRecipes(name, description, image);

    if (!newRecipe) {
      return next(HttpError(500));
    }
    res.status(201).json(newRecipe);
  } catch (e) {
    next(e);
  }
};
