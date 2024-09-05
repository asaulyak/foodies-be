import express from 'express';
import { getAreas } from './areas.controller.js';

export const areasRouter = express.Router();

areasRouter.get('/', getAreas);
