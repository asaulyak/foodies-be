import { Reviews } from '../../common/data/entities/reviews/reviews.entity.js';

export const listReviews = () => {
  return Reviews.findAll();
};
