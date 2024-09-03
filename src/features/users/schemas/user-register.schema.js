import Joi from 'joi';

export const userRegisterSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  name: Joi.string().required()
});
