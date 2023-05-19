import { Request, Response } from 'express';
import knex from '../../db/knex';

export const show = (req: Request, res: Response) => {
  console.log(req, res);
};

export const update = async (req: Request, res: Response) => {
  const profile = await knex('profile').where({ id: res.locals.userId }).update(req.body).returning('*');

  res.status(200).json(profile);
};
