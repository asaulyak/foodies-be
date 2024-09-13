import {
  createRecipes,
  getRecipeById,
  addRecipeToFavorites,
  removeRecipeFromFavorites,
  recipeExists,
  isRecipeFavorite,
  getPopularRecipes,
  getRecipesByFilter,
  removeRecipe
} from './recipes.service.js';
import { HttpError } from '../../common/errors/http-error.js';
import { controllerWrapper } from '../../common/decorators/controller-wrapper.js';
import { uploadRecipeThumb } from '../../common/helpers/cloudinary.js';

export const getById = controllerWrapper(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return next(HttpError(404));
  }

  const recipe = await getRecipeById(id);

  if (!recipe) {
    throw HttpError(404);
  }

  res.json(recipe);
});

export const uploadThumb = controllerWrapper(async (req, res) => {
  if (!req.file) {
    throw HttpError(400, 'Missing the file to upload');
  }

  const { path } = req.file;

  const { secure_url: thumbUrl } = await uploadRecipeThumb(path);

  return res.send(thumbUrl);
});

export const createRecipe = controllerWrapper(async (req, res) => {
  const user = req.user;

  const newRecipe = await createRecipes({ ...req.body, ownerId: user.id });

  if (!newRecipe) {
    throw HttpError(500);
  }
  res.status(201).json(newRecipe);
});

export const getPopular = controllerWrapper(async (req, res) => {
  const popularRecipes = await getPopularRecipes();
  return res.json(popularRecipes);
});

export const searchRecipes = controllerWrapper(async (req, res) => {
  const { categoryId, areaId, ingredientIds } = req.query;
  const { limit, offset } = req.pagination;

  const recipes = await getRecipesByFilter({ categoryId, areaId, ingredientIds, limit, offset });

  res.json(recipes);
});

export const deleteRecipe = controllerWrapper(async (req, res, next) => {
  const { id } = req.params;
  if (!id) {
    return next(HttpError(404));
  }

  const result = await removeRecipe(id);
  if (!result) {
    return next(HttpError(404));
  }
});

export const addToFavorites = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const recipeFound = await recipeExists(id);
    if (!recipeFound) {
      return next(HttpError(404, 'Recipe not found'));
    }

    const alreadyFavorite = await isRecipeFavorite(userId, id);
    if (alreadyFavorite) {
      return next(HttpError(409, 'Recipe already in favorites'));
    }

    const favorite = await addRecipeToFavorites(userId, id);
    res.status(201).json(favorite);
  } catch (error) {
    next(error);
  }
};

export const removeFromFavorites = async (req, res, next) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const recipeFound = await isRecipeFavorite(userId, id);
    if (!recipeFound) {
      return next(HttpError(404, 'Recipe not found'));
    }
    await removeRecipeFromFavorites(userId, id);
    res.sendStatus(204);
  } catch (e) {
    next(e);
  }
};
