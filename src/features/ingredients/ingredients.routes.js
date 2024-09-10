import express from 'express';
import { getIngredients } from './ingredients.controller.js';

export const ingredientsRouter = express.Router();

ingredientsRouter.get('/', getIngredients);
