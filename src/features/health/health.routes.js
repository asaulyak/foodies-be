import express from 'express';
import { liveness, readyness } from './health.controller.js';

export const healthRouter = express.Router();

healthRouter.get('/liveness', liveness);
healthRouter.get('/readyness', readyness);
