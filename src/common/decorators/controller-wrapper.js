import { ValidationError } from 'sequelize';
import { HttpError } from '../errors/http-error.js';

export const controllerWrapper = ctrl => {
  const func = async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (error) {
      if (error instanceof ValidationError) {
        return next(HttpError(422, error.message));
      }

      next(error);
    }
  };

  return func;
};
