import { Areas } from '../../common/data/entities/areas/areas.entity.js';

export const listAreas = () => {
  return Areas.findAll();
};
