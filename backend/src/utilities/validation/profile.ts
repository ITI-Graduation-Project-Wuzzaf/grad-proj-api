import joi from 'joi';

export const profileSchema = joi.object({
  job: joi.string().max(100),
  country: joi.string().max(60),
  citry: joi.string().max(60),
  university: joi.string().max(255),
  gender: joi.string().valid('M', 'F'),
  experience: joi.string().max(100),
  birthdate: joi.date().greater('1950-01-01').less('1-12-2010'),
  // DOB: joi.date().min('1950-01-01').max('2010-12-1'),
  bio: joi.string().max(250),
  skills: joi.array().items(joi.string()).min(2).max(30),
  links: joi.array().items(joi.string()).min(1).max(2),
  portfolio: joi.string(),
});
