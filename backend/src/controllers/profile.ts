import { Request, Response } from 'express';
import knex from '../../db/knex';
import { NotFoundError } from '../errors/notFoundError';

export const show = async (req: Request, res: Response) => {
  const id = +req.params.id;
  const profile = await knex.select('*').from('profile').where({ id }).first();
  if (!profile) {
    throw new NotFoundError();
  }
  res.send(profile);
};

export const update = async (req: Request, res: Response) => {
  const profile = await knex('profile').where({ id: res.locals.userId }).update(req.body).returning('*');

  res.status(200).send(profile);
};
