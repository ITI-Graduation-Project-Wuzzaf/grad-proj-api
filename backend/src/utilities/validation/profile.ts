import joi from 'joi';

export const profileSchema = joi.object({
  address: {
    state: joi.string(),
    street: joi.string(),
  },
  DOB: joi.date().greater(new Date('2012-01-01')),
  referred: joi.boolean().required(),
  // we can make it different type depending on refered
  referralDetails: joi.string().when('referred', {
    is: true,
    then: joi.string().required().min(3),
    otherwise: joi.string().optional(),
  }),
  links: joi.array().items(), //take array of joi types
  // resolves Yes to true
  acceptTos: joi.boolean().truthy('Yes').valid(true).required(),
});
