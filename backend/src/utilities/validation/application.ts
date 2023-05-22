import joi from 'joi';

export const appCreateSchema = joi.object({
  job_id: joi.number().integer().positive().required(),
  cv: joi.string().max(400).required(),
  cover_letter: joi.string().max(600),
  additional_info: joi.string().max(600),
});

export const appUpdateSchema = joi
  .object({
    job_id: joi.number().integer().positive(),
    cv: joi.string().max(400),
    cover_letter: joi.string().max(600),
    additional_info: joi.string().max(600),
  })
  .min(1);
