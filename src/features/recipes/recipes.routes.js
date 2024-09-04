import express from 'express';
import { getById, getPopular } from './recipes.controller.js';

export const recipesRouter = express.Router();

recipesRouter.get('/popular', getPopular);
recipesRouter.get('/:id', getById);
