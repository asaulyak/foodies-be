import Joi from 'joi';

export const userSubscribeSchema = Joi.object({
  subscribedTo: Joi.string().uuid().required().messages({
    'string.empty': 'The subscribedTo field cannot be empty',
    'string.guid': 'The subscribedTo field must be a valid UUID',
    'any.required': 'The subscribedTo field is required'
  })
});
