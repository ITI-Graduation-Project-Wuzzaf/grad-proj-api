import { Request, Response } from 'express';

import * as crud from '../utilities/crud';
import { NotAuthorizeError } from '../errors/notAuthorizedError';

import { IJob } from '../@types/job';
import { NotFoundError } from '../errors/notFoundError';
import { BadRequestError } from '../errors/BadRequestError';
import { IProfile } from '../@types/profile';

const appPerPage = 9;

export const jobApplications = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;

  const jobId = +req.params.id;
  const job = (await crud.show('job', jobId)) as IJob;
  if (job.employer_id !== res.locals.userId) {
    throw new NotAuthorizeError();
  } else if (!job) {
    throw new NotFoundError();
  }

  const where = { job_id: jobId };
  const { pagination, applications } = await crud.jobApplications(page, appPerPage, where);
  res.send({ pagination, applications });
};

export const userApplications = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;

  const where = { user_id: res.locals.userId };
  const { pagination, applications } = await crud.userApplications(page, appPerPage, where);

  res.send({ pagination, applications });
};

export const show = async (req: Request, res: Response) => {
  const id = +req.params.id;

  const application = await crud.appDetails(id, res.locals.userId);

  res.send(application);
};

export const create = async (req: Request, res: Response) => {
  if (req.body.cv === 'old') {
    const userProfile = (await crud.show('profile', res.locals.userId)) as IProfile;
    if (!userProfile.cv) throw new BadRequestError("User Doesn't have a cv already ");
    req.body.cv = userProfile.cv;
  }

  const application = await crud.create('application', { ...req.body, user_id: res.locals.userId }).catch((err) => {
    if (err.constraint === 'application_user_id_job_id_unique') {
      throw new BadRequestError('User applying for the same job more than once');
    }

    throw new NotFoundError();
  });
  res.status(201).send(application);
};

export const update = async (req: Request, res: Response) => {
  const id = +req.params.id;
  const application = await crud.update('application', id, req.body, 'user_id', res.locals.userId);
  res.send(application);
};

export const respond = async (req: Request, res: Response) => {
  const id = +req.params.id;

  const title = await crud.respond(req.body, id, res.locals.userId);

  res.send(title);
};
