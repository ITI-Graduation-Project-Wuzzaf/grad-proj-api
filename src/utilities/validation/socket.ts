import joi from 'joi';

export const socketSchema = joi.object({
  id: joi.number().integer().positive().required(),
  role: joi.string().valid('user', 'employer', 'admin').required(),
});

export const notifSchema = joi.object({
  id: joi.number().integer().positive().required(),
  role: joi.string().valid('user', 'employer', 'admin').required(),
  jobId: joi.number().integer().positive().required(),
  jobName: joi.string().max(100).required(),
  appId: joi.number().integer().positive().required(),
});
