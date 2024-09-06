import { listAreas } from './areas.service.js';
import { HttpError } from '../../common/errors/http-error.js';

export const getAreas = async (_, res, next) => {
  try {
    const areas = await listAreas();
    res.json(areas);
  } catch (error) {
    next(HttpError(500));
  }
};
