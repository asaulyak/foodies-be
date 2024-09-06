import express from 'express';
import { getCategories } from './categories.controller.js';
import { paginationMiddleware } from '../../common/middleware/pagination.middleware.js';

export const categoriesRouter = express.Router();

categoriesRouter.get('/', paginationMiddleware, getCategories);
