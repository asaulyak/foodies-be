import { controllerWrapper } from '../../common/decorators/controller-wrapper.js';
import { HttpError } from '../../common/errors/http-error.js';
import { listReviews } from './review.service.js';

export const getReviews = controllerWrapper(async (req, res, next) => {
  const reviews = await listReviews();

  res.status(200).json(reviews);
});
