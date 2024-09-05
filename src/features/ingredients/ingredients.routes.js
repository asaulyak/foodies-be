import express from 'express';
import { getIngredients } from './ingredients.controller.js';
import { paginationMiddleware } from '../../common/middleware/pagination.middleware.js';

export const ingredientsRouter = express.Router();

ingredientsRouter.get('/', paginationMiddleware, getIngredients);
