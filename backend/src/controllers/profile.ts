import { Request, Response } from 'express';
import knex from '../../db/knex';
import { BadRequestError } from '../errors/BadRequestError';

export const update = async (req: Request, res: Response) => {
  const id = +req.params.id;

  // IMPORTANT  make sure to check if the profile exists
  if (Object.entries(req.body).length) {
    throw new BadRequestError('You must at least update 1 property');
  }

  const profile = await knex('profile').where({ id }).update(req.body).returning('*');
  console.log('bonaki');

  res.status(200).json(profile);
};
