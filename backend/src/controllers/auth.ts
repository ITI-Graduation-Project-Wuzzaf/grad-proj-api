import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { BadRequestError } from '../errors/BadRequestError';

import knex from '../../db/knex';

const { SR, PEPPER, JWT_SECRET, JWT_ACCESS_EXPIRY } = process.env;

// HERE  signup
export const signup = async (req: Request, res: Response) => {
  const { email, password, first_name, last_name } = req.body;

  const existingUser = await knex.select('*').from('user_account').where('email', 'ILIKE', email).first();

  if (existingUser) {
    throw new BadRequestError(`Email: ${email} is already used`);
  }

  const hashedPassword = await bcrypt.hash(password + PEPPER, Number(SR));

  const user = await knex('user_account')
    .insert({ email, password: hashedPassword, first_name, last_name })
    .returning(['email', 'id']);

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
