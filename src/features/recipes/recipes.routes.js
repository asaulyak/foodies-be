import express from 'express';
import {
  getById,
  searchRecipes,
  deleteRecipe,
  getPopular,
  removeFromFavorites,
  createRecipe,
  addToFavorites,
  getFavorites
} from './recipes.controller.js';
import { authMiddleware } from '../../common/middleware/auth.middleware.js';
import { recipesCreateSchema } from './schemas/recipes-create.schemas.js';
import { validateBodyMiddleware } from '../../common/middleware/validate-body.middleware.js';
import { validateQueryStringMiddleware } from '../../common/middleware/validate-query-string.middleware.js';
import { recipesSearchSchema } from './schemas/recipes-search.schemas.js';
import { paginationMiddleware } from '../../common/middleware/pagination.middleware.js';

export const recipesRouter = express.Router();

recipesRouter.get('/popular', getPopular);
recipesRouter.get('/search', validateQueryStringMiddleware(recipesSearchSchema), paginationMiddleware, searchRecipes);
recipesRouter.get('/:id', getById);
recipesRouter.post('/', authMiddleware, validateBodyMiddleware(recipesCreateSchema), createRecipe);

recipesRouter.post('/:id/favorites', authMiddleware, addToFavorites);
recipesRouter.delete('/:id/favorites', authMiddleware, removeFromFavorites);
recipesRouter.delete('/:id', authMiddleware, deleteRecipe);
recipesRouter.get('/:id/favorites', authMiddleware, getFavorites);
