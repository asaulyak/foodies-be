import express from 'express';
import { getReviews } from './review.controller.js';

export const reviewRouter = express.Router();
reviewRouter.get('/', getReviews);
