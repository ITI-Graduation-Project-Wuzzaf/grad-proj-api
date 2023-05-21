import { Request, Response } from 'express';

import * as crud from '../utilities/crud';
import { NotAuthorizeError } from '../errors/notAuthorizedError';
import knex from '../../db/knex';

import { IJob } from '../@types/job';
import { NotFoundError } from '../errors/notFoundError';

const appPerPage = 6;

export const jobApplications = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;

  const jobId = +req.params.id;
  const job = (await crud.show('job', jobId)) as IJob;
  if (job.employer_id !== res.locals.userId) {
    throw new NotAuthorizeError();
  }

  const where = { job_id: jobId };
  const { pagination, instances } = await crud.pagination('application', page, appPerPage, where);

  res.send({ pagination, applications: instances });
};

export const userApplications = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;

  const where = { user_id: res.locals.userId };
  const { pagination, instances } = await crud.pagination('application', page, appPerPage, where);
  res.send({ pagination, applications: instances });
};

export const show = async (req: Request, res: Response) => {
  const id = +req.params.id;
  const application = await knex('application')
    .join('user_account', 'user_id', '=', 'id')
    .join('job', 'job_id', '=', 'id')
    .where('applicatio.id', id)
    // .andWhere(function () {
    //   this.where('user_account.id', res.locals.userId).orWhere('job.employer_id', res.locals.userId);
    // })
    .andWhere('user_account.id', res.locals.userId)
    .orWhere('job.employer_id', res.locals.userId)
    .select('application.*');

  if (!application[0]) {
    throw new NotFoundError();
  }

  res.send(application);
};
