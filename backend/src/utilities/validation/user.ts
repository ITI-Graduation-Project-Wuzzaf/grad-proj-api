import joi from 'joi';

export const signupSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).max(16).required(),
  confirmPassword: joi.ref('password'),
  first_name: joi.string().max(20).required(),
  last_name: joi.string().max(50).required(),
});

export const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).max(16).required(),
});

export const contactSchema = joi.object({
  name: joi.string().max(40).min(2).required(),
  email: joi.string().email().required(),
  message: joi.string().min(10).max(400).required(),
});
