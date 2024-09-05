import express from 'express';
import { getById, removeFromFavorites, createRecipe, addToFavorites } from './recipes.controller.js';
import { authMiddleware } from '../../common/middleware/auth.middleware.js';
import { recipesCreateSchema } from './schemas/recipes-create.schemas.js';
import { validateBodyMiddleware } from '../../common/middleware/validate-body.middleware.js';

export const recipesRouter = express.Router();

recipesRouter.get('/:id', getById);
recipesRouter.post('/', authMiddleware, validateBodyMiddleware(recipesCreateSchema), createRecipe);

recipesRouter.post('/:id/favorites', authMiddleware, addToFavorites);
recipesRouter.delete('/:id/favorites', authMiddleware, removeFromFavorites);
