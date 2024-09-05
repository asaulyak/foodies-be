import { HttpError } from '../../common/errors/http-error.js';
import { listReviews } from './review.service.js';

export const getReviews = async (req, res, next) => {
  try {
    const reviews = await listReviews();
    if (!reviews || reviews.length === 0) {
      throw new HttpError(404, 'No reviews found');
    }
    res.status(200).json(reviews);
  } catch (error) {
    next(error);
  }
};
