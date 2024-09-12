import { Reviews } from '../../common/data/entities/reviews/reviews.entity.js';
import { Users } from '../../common/data/entities/users/users.entity.js';

export const listReviews = () => {
  return Reviews.findAll({
    include: [
      {
        model: Users,
        attributes: ['id', 'name']
      }
    ]
  });
};
