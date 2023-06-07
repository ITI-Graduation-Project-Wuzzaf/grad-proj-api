import joi from 'joi';

export const employerSignupSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).max(16).required(),
  confirmPassword: joi.ref('password'),
  name: joi.string().max(100).required(),
  country: joi.string().max(60),
  city: joi.string().max(60),
  description: joi.string().max(255),
  website: joi.string(),
  industry: joi.string().max(100),
  size: joi.number().integer().positive(),
});

export const employerUpdateSchema = joi
  .object({
    country: joi.string().max(60).empty(''),
    city: joi.string().max(60).empty(''),
    description: joi.string().max(255).empty(''),
    website: joi.string().empty(''),
    industry: joi.string().max(100).empty(''),
    logo: joi.string().max(255).empty(''),
    size: joi.number().integer().positive().empty(''),
  })
  .options({ stripUnknown: true })
  .min(1);
