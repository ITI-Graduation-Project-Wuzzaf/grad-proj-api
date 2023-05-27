import joi from 'joi';

export const jobCreateSchema = joi.object({
  title: joi.string().max(200).required(),
  description: joi.string().max(600).required(),
  type: joi.string().valid('Part-time', 'Full-time').required(),
  location: joi.string().required(),
  category: joi.string().valid('Development', 'Design', 'Marketing', 'Business', 'Support').required(),
  min_salary: joi.number().integer().positive(),
  max_salary: joi
    .number()
    .integer()
    .positive()
    .greater(joi.ref('min_salary'))
    .message('max salary must be greater than min salary'),
  experience: joi.string().max(100),
  skills: joi.array().items(joi.string()).min(2).max(30),
});

export const jobUpdateSchema = joi
  .object({
    title: joi.string().max(200),
    description: joi.string().max(600),
    type: joi.string().valid('Part-time', 'Full-time'),
    location: joi.string(),
    min_salary: joi.number().integer().positive(),
    max_salary: joi
      .number()
      .integer()
      .positive()
      .greater(joi.ref('min_salary'))
      .message('max salary must be greater than min salary'),
    experience: joi.string().max(100),
    skills: joi.array().items(joi.string()).min(2).max(30),
  })
  .min(1);
