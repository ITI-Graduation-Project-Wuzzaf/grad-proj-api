import bcrypt from 'bcrypt';

import knex from '../../db/knex';
import { BadRequestError } from '../errors/BadRequestError';
import { NotFoundError } from '../errors/notFoundError';
import { IUser } from '../@types/user';
import { IEmployer } from '../@types/employer';
import { isPwned } from './preventPwned';

type Table = 'user_account' | 'profile' | 'employer' | 'job' | 'application' | 'user_saved_job';

const { SR, PEPPER } = process.env;

export const pagination = async (table: Table, page: number, perPage: number, where?: object) => {
  const q1 = knex(table);
  const q2 = knex(table);
  if (where) {
    q1.where(where);
    q2.where(where);
  }
  const skip = (page - 1) * perPage;
  const total = +(await q1.count('id'))[0].count;
  const numberOfPages = Math.ceil(total / perPage);
  const next = page * perPage < total ? true : false;
  const prev = page > 1 ? true : false;
  const instances = await q2.limit(perPage).offset(skip);

  return { pagination: { page, next, prev, numberOfPages, total }, instances };
};

export const show = async (table: Table, id: number) => {
  const instance = await knex.select('*').from(table).where({ id }).first();
  if (!instance) {
    throw new NotFoundError();
  }
  return instance;
};

export const create = async (table: Table, body: object) => {
  const instance = await knex(table).insert(body).returning('*');
  return instance[0];
};

export const update = async (table: Table, id: number, body: object, col?: string, owner?: number) => {
  const query = knex(table).where({ id });
  if (col) {
    query.andWhere(col, owner);
  }
  const instance = await query.update(body).returning('*');
  if (!instance.length) {
    throw new NotFoundError();
  }
  return instance[0];
};

export const remove = async (table: Table, id: number, col?: string, owner?: number) => {
  const query = knex(table).where({ id });
  if (col) {
    query.andWhere(col, owner);
  }

  const instance = await query.delete().returning('id');
  if (!instance.length) {
    throw new NotFoundError();
  }
};

export const signup = async (table: 'user_account' | 'employer', body: IUser | IEmployer) => {
  const existingUser = await searchAccounts(body.email);

  if (existingUser) {
    throw new BadRequestError(`Email: ${body.email} is already used`);
  }

  const isBreached = await isPwned(body.password);
  if (isBreached) throw new BadRequestError('Password is vulnerable, Please use another password.');

  const hashedPassword = await bcrypt.hash(body.password + PEPPER, Number(SR));

  const instance = await knex(table)
    .insert({ ...body, password: hashedPassword })
    .returning('*');

  const { password, ...user } = instance[0];

  return user;
};

export const searchAccounts = async (email: string) => {
  const existingUser = await knex.select('*').from('user_account').where('email', 'ILIKE', email);
  if (existingUser[0]) {
    return existingUser[0];
  }
  const existingEmp = await knex.select('*').from('employer').where('email', 'ILIKE', email);
  return existingEmp[0];
};

// for single specific entity

export const employerJobs = async (employerId: number, page: number, perPage: number) => {
  const where = { employer_id: employerId };
  const skip = (page - 1) * perPage;
  const total = +(await knex('job').where(where).count('id'))[0].count;

  const jobs = await knex('job')
    .select('job.*')
    .count('application.id as applications_number')
    .leftJoin('application', 'job.id', '=', 'application.job_id')
    .where(where)
    .groupBy('job.id')
    .limit(perPage)
    .offset(skip);

  const numberOfPages = Math.ceil(total / perPage);
  const next = page * perPage < total ? true : false;
  const prev = page > 1 ? true : false;
  return { pagination: { page, next, prev, numberOfPages, total }, jobs };
};

export const userSavedJobs = async (userId: number, page: number, perPage: number) => {
  const where = { user_id: userId };
  const skip = (page - 1) * perPage;
  const total = +(
    await knex('job').join('user_saved_job', 'job.id', '=', 'user_saved_job.job_id').where(where).count('title')
  )[0].count;

  const jobs = await knex('job')
    .select('job.*')
    .join('user_saved_job', 'job.id', '=', 'user_saved_job.job_id')
    .where(where)
    .limit(perPage)
    .offset(skip);

  const numberOfPages = Math.ceil(total / perPage);
  const next = page * perPage < total ? true : false;
  const prev = page > 1 ? true : false;
  return { pagination: { page, next, prev, numberOfPages, total }, jobs };
};

export const removeSavedJob = async (userId: number, jobId: number) => {
  const where = { user_id: userId, job_id: jobId };

  const instance = await knex('user_saved_job').delete().where(where).returning('id');
  if (!instance.length) {
    throw new NotFoundError();
  }
};

export const jobApplications = async (page: number, perPage: number, where: object) => {
  const q1 = knex('application').where(where);
  const q2 = q1.clone();

  const total = +(await q1.count('id'))[0].count;
  const skip = (page - 1) * perPage;
  const numberOfPages = Math.ceil(total / perPage);
  const next = page * perPage < total ? true : false;
  const prev = page > 1 ? true : false;

  const applications = await q2
    .join('user_account', 'application.user_id', 'user_account.id')
    .select('application.*', 'first_name', 'last_name', 'email')
    .limit(perPage)
    .offset(skip);

  return { pagination: { page, next, prev, numberOfPages, total }, applications };
};

export const userApplications = async (page: number, perPage: number, where: object) => {
  const q1 = knex('application').where(where);
  const q2 = q1.clone();

  const total = +(await q1.count('id'))[0].count;
  const skip = (page - 1) * perPage;
  const numberOfPages = Math.ceil(total / perPage);
  const next = page * perPage < total ? true : false;
  const prev = page > 1 ? true : false;

  const applications = await q2
    .join('job', 'application.job_id', 'job.id')
    .select('application.*', 'title', 'description')
    .limit(perPage)
    .offset(skip);

  return { pagination: { page, next, prev, numberOfPages, total }, applications };
};

export const respond = async (body: object, id: number, employer_id: number) => {
  const result = await knex('application')
    .update(body)
    .whereIn('job_id', function () {
      this.select('id').from('job').where({ employer_id });
    })
    .where('application.id', id)
    .returning('job_id');

  if (!result.length) {
    throw new NotFoundError();
  }

  const jobName = await knex('job').select('title').where({ id: result[0].job_id });

  return jobName[0];
};

export const jobDetails = async (id: number) => {
  const instance = await knex('job')
    .join('employer', 'job.employer_id', '=', 'employer.id')
    .select('name', 'logo', 'job.*')
    .where('job.id', id);

  if (!instance) {
    throw new NotFoundError();
  }
  return instance[0];
};

export const employerDetails = async (id: number) => {
  const employer = await knex('employer').select('*').where({ id }).first();
  if (!employer) {
    throw new NotFoundError();
  }
  const jobs = await knex('job').select('*').where({ employer_id: id });
  return { employer, jobs };
};

export const appDetails = async (id: number, userId: number) => {
  const application = await knex('application')
    .join('user_account', 'application.user_id', '=', 'user_account.id')
    .join('job', 'application.job_id', '=', 'job.id')
    .where('application.id', id)
    .andWhere(function () {
      this.where('user_account.id', userId).orWhere('job.employer_id', userId);
    })
    .select('first_name', 'last_name', 'email', 'application.*', 'title');

  if (!application[0]) {
    throw new NotFoundError();
  }

  return application[0];
};

// FTS

export const search = async (page: number, perPage: number, userId?: string, query?: string, category?: string) => {
  const skip = (page - 1) * perPage;

  const q = knex('job').join('employer', 'job.employer_id', '=', 'employer.id');
  if (query) {
    q.whereRaw('to_tsvector(title) || to_tsvector(name) || to_tsvector(job.description) @@ to_tsquery(?)', [
      `'${query}':*`,
    ]);
  }
  if (category) {
    q.whereRaw(`to_tsvector(category) @@ to_tsquery(?)`, [category]);
  }
  const q2 = q.clone();

  const total = +(await q2.count('title'))[0].count;

  if (userId) {
    q.select(knex.raw('CASE WHEN usj.user_id IS NOT NULL THEN true ELSE FALSE END AS is_saved')).leftJoin(
      'user_saved_job as usj',
      function () {
        this.on('job.id', '=', 'usj.job_id').andOnVal('usj.user_id', '=', userId);
      },
    );
  }

  const jobs = await q
    .select('job.*', 'employer.name', 'employer.logo')
    .limit(perPage)
    .offset(skip)
    .orderBy('featured', 'desc');
  const numberOfPages = Math.ceil(total / perPage);
  const next = page * perPage < total ? true : false;
  const prev = page > 1 ? true : false;

  return { pagination: { page, next, prev, numberOfPages, total }, jobs };
};
