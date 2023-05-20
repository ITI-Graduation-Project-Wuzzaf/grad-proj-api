import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import knex from '../../db/knex';
import * as crud from '../utilities/crud';

import { BadRequestError } from '../errors/BadRequestError';

const { PEPPER, JWT_SECRET, JWT_ACCESS_EXPIRY } = process.env;

// HERE  signup
export const signup = async (req: Request, res: Response) => {
  const { confirmPassword, ...body } = req.body;

  const user = await crud.signup('user_account', body);

  await knex('profile').insert({ id: user[0].id });

  const accessToken = jwt.sign({ id: user[0].id, email: user[0].email }, JWT_SECRET + '', {
    expiresIn: JWT_ACCESS_EXPIRY + '',
  });

  res.status(201).send({ user: user[0], accessToken });
};

// HERE  LOGIN
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await knex.select('*').from('user_account').where('email', 'ILIKE', email).first();

  if (!existingUser) {
    throw new BadRequestError('Invalid email or password.');
  }
  const isMatched = await bcrypt.compare(password + PEPPER, existingUser.password);
  if (!isMatched) {
    throw new BadRequestError('Invalid email or password.');
  }

  const { password: omitted, ...user } = existingUser;
  const accessToken = jwt.sign({ id: existingUser.id, email: existingUser.email }, JWT_SECRET + '', {
    expiresIn: JWT_ACCESS_EXPIRY + '',
  });

  res.status(200).send({ user, accessToken });
};

// export const logout = (req: Request, res: Response) => {};
