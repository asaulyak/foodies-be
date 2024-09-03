import express from 'express';
import { getById } from './recipes.controller.js';

export const recipesRouter = express.Router();

recipesRouter.get('/:id', getById);
