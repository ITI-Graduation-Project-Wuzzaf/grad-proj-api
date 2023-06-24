import type { Request, Response } from 'express';

import * as crud from '../utilities/crud';

const perPage = 20;

export const users = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const { pagination, instances } = await crud.pagination('user_account', page, perPage);

  res.send({ pagination, users: instances });
};

export const removeUser = async (req: Request, res: Response) => {
  const id = req.params.id;
  await crud.remove('profile', +id);
  await crud.remove('user_account', +id);
  res.sendStatus(204);
};

export const employers = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const { pagination, instances } = await crud.pagination('employer', page, perPage);

  res.send({ pagination, employers: instances });
};

export const removeEmployer = async (req: Request, res: Response) => {
  const id = req.params.id;
  await crud.remove('employer', +id);
  res.sendStatus(204);
};

export const jobs = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const { pagination, instances } = await crud.pagination('job', page, perPage);

  res.send({ pagination, jobs: instances });
};

export const removeJob = async (req: Request, res: Response) => {
  const id = req.params.id;
  await crud.remove('job', +id);
  res.sendStatus(204);
};
