import joi from 'joi';

export const signupSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(3).max(16).required(),
  confirmPassword: joi.ref('password'),
  first_name: joi.string().max(20).required(),
  last_name: joi.string().max(50).required(),
});

export const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(3).max(16).required(),
});
