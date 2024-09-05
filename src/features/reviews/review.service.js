import { Reviews } from '../../common/data/entities/reviews/reviews.entity.js';

export const listReviews = async () => {
  try {
    const reviews = await Reviews.findAll();
    return reviews;
  } catch (error) {
    throw new Error('Error retrieving reviews');
  }
};
