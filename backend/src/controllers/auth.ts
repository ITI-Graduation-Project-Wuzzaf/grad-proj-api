import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { BadRequestError } from '../errors/BadRequestError';

import knex from '../../db/knex';

export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await knex.select('*').from('user_account').where('email', 'ILIKE', email).first();

  if (existingUser) {
    throw new BadRequestError(`Email: ${email} is already used`);
  }

  const hashedPassword = await bcrypt.hash(password, 8);

  const user = await knex.insert({ email, password: hashedPassword }).into('user_account').returning(['email', 'id']);

  const accessToken = jwt.sign({ id: user[0].id, email: user[0].email }, 'secret');

  res.status(201).send({ user: user[0], accessToken });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const existingUser = await knex.select('*').from('user_account').where('email', 'ILIKE', email).first();

  if (!existingUser) {
    throw new BadRequestError('Invalid email or password.');
  }
  const isMatched = await bcrypt.compare(password, existingUser.password);
  if (!isMatched) {
    throw new BadRequestError('Invalid email or password.');
  }

  const { password: omitted, ...user } = existingUser;
  const accessToken = jwt.sign({ id: existingUser.id, email: existingUser.email }, 'secret');
  res.status(200).send({ user, accessToken });
};

// export const logout = (req: Request, res: Response) => {};
