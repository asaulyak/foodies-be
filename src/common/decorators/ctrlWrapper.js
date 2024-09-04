import { ValidationError } from 'sequelize';
import { HttpError } from '../errors/http-error.js';

const ctrlWrapper = ctrl => {
  const func = async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      if (error instanceof ValidationError) {
        return next(HttpError(400));
      }

      next(error);
    }
  };

  return func;
};

export default ctrlWrapper;
