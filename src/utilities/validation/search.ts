import joi from 'joi';

export const searchSchema = joi.object({
  q: joi.string().max(400).empty(''),
  cate: joi.string().max(50).empty(''),
  page: joi.number().min(1).default(1),
  size: joi.number().min(1).max(20).default(6),
});
