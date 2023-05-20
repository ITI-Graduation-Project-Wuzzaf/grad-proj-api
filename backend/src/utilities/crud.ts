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
  const existingUser = await knex.select('*').from(table).where('email', 'ILIKE', body.email).first();

  if (existingUser) {
    throw new BadRequestError(`Email: ${body.email} is already used`);
  }

  const hashedPassword = await bcrypt.hash(body.password + PEPPER, Number(SR));

  const user = await knex(table)
    .insert({ ...body, password: hashedPassword })
    .returning(['email', 'id']);
  return user[0];
};
