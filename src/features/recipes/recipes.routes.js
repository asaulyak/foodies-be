import express from 'express';
import { getById, getPopular } from './recipes.controller.js';

export const recipesRouter = express.Router();

recipesRouter.get('/:id', getById);
recipesRouter.get('/popular', getPopular);
