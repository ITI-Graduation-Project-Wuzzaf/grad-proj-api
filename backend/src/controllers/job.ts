import { Request, Response } from 'express';

import * as crud from '../utilities/crud';

export const index = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  console.log(page);

  res.send('paginated jobs');
};

export const create = async (req: Request, res: Response) => {
  const job = await crud.create('job', req.body);
  res.send(job);
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
