import joi from 'joi';

export const searchSchema = joi.object({
  query: joi.string().max(400).empty(''),
  category: joi.string().max(50).empty(''),
  page: joi.number().min(1).default(1),
  size: joi.number().min(1).max(20).default(6),
});
