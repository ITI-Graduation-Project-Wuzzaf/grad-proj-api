import Joi from 'joi';
import joi from 'joi';

export const appCreateSchema = joi.object({
  job_id: joi.number().integer().positive().required(),
  cv: joi.string().max(400).required(),
  cover_letter: joi.string().max(600),
  additional_info: joi.string().max(600),
});

export const appUpdateSchema = joi
  .object({
    cv: joi.string().max(400),
    cover_letter: joi.string().max(600),
    additional_info: joi.string().max(600),
  })
  .min(1);

export const respondSchema = joi
  .object({
    status: Joi.string().valid('rejected', 'in-consideration').empty(''),
    feedback: Joi.string().max(400).empty(''),
  })
  .options({ stripUnknown: true })
  .min(1);
