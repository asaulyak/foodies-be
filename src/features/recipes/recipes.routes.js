import express from 'express';
import { getById } from './recipes.controller.js';
import { authMiddleware } from '../../common/middleware/auth.middleware.js';
import { createRecipes } from './recipes.controller.js';

export const recipesRouter = express.Router();

recipesRouter.get('/:id', getById);
recipesRouter.post('/', authMiddleware, createRecipes);
