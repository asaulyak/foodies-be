import Joi from 'joi';

export const recipesSearchSchema = Joi.object({
  categoryId: Joi.string().optional(),
  areaId: Joi.string().optional(),
  ingredientIds: Joi.array().items(Joi.string()).optional()
}).unknown();
