import { listIngredients } from './ingredients.service.js';
import { HttpError } from '../../common/errors/http-error.js';
import { controllerWrapper } from '../../common/decorators/controller-wrapper.js';

export const getIngredients = controllerWrapper(async (req, res) => {
  const ingredients = await listIngredients();
  if (!ingredients) {
    throw HttpError(500);
  }

  res.json(ingredients);
});
