import express from 'express';
import { getById } from './recipes.controller.js';
import { authMiddleware } from '../../common/middleware/auth.middleware.js';
import { createRecipe } from './recipes.controller.js';
import { recipesCreateSchema } from './schemas/recipes-create.schemas.js';
import { validateBodyMiddleware } from '../../common/middleware/validate-body.middleware.js';

export const recipesRouter = express.Router();

recipesRouter.get('/:id', getById);
recipesRouter.post('/', validateBodyMiddleware(recipesCreateSchema), authMiddleware, createRecipe);
