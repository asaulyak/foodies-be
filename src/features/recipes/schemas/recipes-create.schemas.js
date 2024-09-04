import Joi from 'joi';

export const recipesCreateSchema = Joi.object({
  title: Joi.string().required(),
  instructions: Joi.string().required(),
  description: Joi.string().required(),
  thumb: Joi.string().required(),
  time: Joi.string().required(),
  categoryId: Joi.string().required(),
  areaId: Joi.string().required()
});
