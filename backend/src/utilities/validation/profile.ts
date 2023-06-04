import joi from 'joi';

export const profileSchema = joi
  .object({
    job: joi.string().max(100).empty(''),
    country: joi.string().max(60).empty(''),
    city: joi.string().max(60).empty(''),
    university: joi.string().max(255).empty(''),
    gender: joi.string().valid('M', 'F').empty(''),
    experience: joi.string().max(100).empty(''),
    birthdate: joi.date().greater('1950-01-01').less('1-12-2010').empty(''),
    // DOB: joi.date().min('1950-01-01').max('2010-12-1'),
    profile_picture: joi.string().max(250).empty(''),
    cv: joi.string().max(250).empty(''),
    bio: joi.string().max(250).empty(''),
    skills: joi.array().items(joi.string()).min(2).max(30).empty(''),
    links: joi.array().items(joi.string()).min(1).max(2).empty(''),
    portfolio: joi.string().empty(''),
  })
  .options({ stripUnknown: true })
  .min(1);
