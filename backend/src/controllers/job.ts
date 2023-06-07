import { Request, Response } from 'express';

import * as crud from '../utilities/crud';

const owner = 'employer_id';
const jobsPerPage = 6;

// const page = Number(req.query.page) || 1;
// const { pagination, instances } = await crud.pagination('job', page, jobsPerPage);

export const index = async (req: Request, res: Response) => {
  // IMPORTANT  we still need to know what will be the search target
  // const query = (req.query.query as string) || '';
  const page = Number(req.query.page) || 1;
  const { pagination, instances } = await crud.pagination('job', page, jobsPerPage);

  res.send({ pagination, jobs: instances });
};

export const employerJobs = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const { pagination, jobs } = await crud.employerJobs(res.locals.userId, page, jobsPerPage);
  res.send({ pagination, jobs });
};

export const create = async (req: Request, res: Response) => {
  const job = await crud.create('job', { ...req.body, employer_id: res.locals.userId });
  res.status(201).send(job);
};

export const show = async (req: Request, res: Response) => {
  const id = +req.params.id;
  const job = await crud.show('job', id);
  res.send(job);
};

export const update = async (req: Request, res: Response) => {
  const id = +req.params.id;
  const job = await crud.update('job', id, req.body, owner, res.locals.userId);
  res.send(job);
};

export const remove = async (req: Request, res: Response) => {
  const id = +req.params.id;

  await crud.remove('job', id, owner, res.locals.userId);
  res.send(`Job ${id} has been deleted.`);
};
