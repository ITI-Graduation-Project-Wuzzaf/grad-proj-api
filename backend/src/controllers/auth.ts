import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import knex from './../config/db-conf';

export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // IMPORTANT  knex in where clause when getting value of undefined throws an error (use validator)
  const existingUser = await knex.select('*').from('user_account').where('email', 'ILIKE', email).first();

  if (existingUser) {
    throw new Error('nope, this email is already used buddy');
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
    throw new Error('invalid credentials');
  }
  const isMatched = await bcrypt.compare(password, existingUser.password);
  if (!isMatched) {
    throw new Error('invalid credentials');
  }

  const { password: omitted, ...user } = existingUser;
  const accessToken = jwt.sign({ id: existingUser.id, email: existingUser.email }, 'secret');
  res.status(200).send({ user, accessToken });
};

// export const logout = (req: Request, res: Response) => {};
