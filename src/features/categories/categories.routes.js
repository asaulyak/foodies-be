import express from 'express';
import { getCategories } from './categories.controller.js';

export const categoriesRouter = express.Router();

categoriesRouter.get('/categories', getCategories);
