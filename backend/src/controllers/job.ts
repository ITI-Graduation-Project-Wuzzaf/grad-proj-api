import { Request, Response } from 'express';

import * as crud from '../utilities/crud';
import knex from '../../db/knex';

const jobsPerPage = 8;

export const index = async (req: Request, res: Response) => {
  // IMPORTANT  we still need to know what will be the search target
  // const query = (req.query.query as string) || '';
  const page = Number(req.query.page) || 1;
  const skip = (page - 1) * jobsPerPage;
  const total = +(await knex('job').count('id'))[0].count;
  const numberOfPages = Math.ceil(total / jobsPerPage);
  const next = page * jobsPerPage < total ? true : false;
  const prev = page > 1 ? true : false;
  const jobs = await knex('job').limit(jobsPerPage).offset(skip);
  res.send({ pagination: { page, next, prev, numberOfPages, total }, jobs });
};

export const create = async (req: Request, res: Response) => {
  const job = await crud.create('job', req.body);
  res.status(201).send(job);
};

export const show = async (req: Request, res: Response) => {
  const id = +req.params.id;
  const job = await crud.show('job', id);
  res.send(job);
};

export const update = async (req: Request, res: Response) => {
  const id = +req.params.id;
  const job = await crud.update('job', id, req.body);
  res.send(job);
};
export const remove = async (req: Request, res: Response) => {
  const id = +req.params.id;
  await crud.remove('job', id);
  res.send(`Job ${id} has been deleted.`);
};
