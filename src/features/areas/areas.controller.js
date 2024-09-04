import { listAreas } from './areas.service.js';

export const getAreas = async (_, res) => {
  try {
    const areas = await listAreas();
    res.json(areas);
  } catch (error) {
    next(HttpError(500));
  }
};
