import { Request, Response } from 'express';

import mail from '../utilities/mailing';
import * as crud from '../utilities/crud';
import * as notifCrud from '../utilities/notifications';

export const contactUs = async (req: Request, res: Response) => {
  const { name, email, message } = req.body;

  mail('baselsalah2053@gmail.com', 'Jobify is happy to have you', email, name, message);
  res.send({});
};

export const saveJob = async (req: Request, res: Response) => {
  const userId = res.locals.userId;
  const jobId = req.body.jobId;

  await crud.create('user_saved_job', { user_id: userId, job_id: jobId });

  res.sendStatus(204);
};

export const removeSavedJob = async (req: Request, res: Response) => {
  const userId = res.locals.userId;
  const jobId = req.body.jobId;

  await crud.removeSavedJob(userId, jobId);
  res.sendStatus(204);
};

export const userSavedJobs = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const { pagination, jobs } = await crud.userSavedJobs(res.locals.userId, page, 8);
  res.send({ pagination, jobs });
};

export const getNotifications = async (req: Request, res: Response) => {
  const userId = res.locals.userId;
  const role = res.locals.role;
  const page = Number(req.query.page) || 1;
  const { notifications, pagination } = await notifCrud.pagination(userId, role, page);

  res.send({ pagination, notifications });
};
