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

// FTS

export const search = async (page: number, perPage: number, query?: string, category?: string) => {
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

  const jobs = await q.select('job.*', 'employer.name', 'employer.logo').limit(perPage).offset(skip);

  const numberOfPages = Math.ceil(total / perPage);
  const next = page * perPage < total ? true : false;
  const prev = page > 1 ? true : false;

  return { pagination: { page, next, prev, numberOfPages, total }, jobs };
};
