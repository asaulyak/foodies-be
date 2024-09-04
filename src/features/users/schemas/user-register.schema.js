import Joi from 'joi';
import { emailRegexp } from '../../../common/auth/authConstants.js';

export const userRegisterSchema = Joi.object({
  email: Joi.string().pattern(emailRegexp).required(),
  password: Joi.string().required(),
  name: Joi.string().required()
});
