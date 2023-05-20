import bcrypt from 'bcrypt';

import knex from '../../db/knex';
import { BadRequestError } from '../errors/BadRequestError';
import { NotFoundError } from '../errors/notFoundError';
import { IUser } from '../@types/user';
import { IEmployer } from '../@types/employer';

type Table = 'user_account' | 'profile' | 'employer' | 'job';

const { SR, PEPPER } = process.env;

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

export const update = async (table: Table, id: number, body: object) => {
  const instance = await knex(table).where({ id }).update(body).returning('*');
  if (!instance.length) {
    throw new NotFoundError();
  }
  return instance[0];
};

export const remove = async (table: Table, id: number) => {
  const instance = await knex(table).where({ id }).del().returning('*');
  if (!instance.length) {
    throw new NotFoundError();
  }
};

export const signup = async (table: 'user_account' | 'employer', body: IUser | IEmployer) => {
  const existingUser = await searchAccounts(body.email);

  if (existingUser) {
    throw new BadRequestError(`Email: ${body.email} is already used`);
  }

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
