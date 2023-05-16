import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import knex from './../config/db-conf';

export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // IMPORTANT  knex in where clause when getting value of undefined throws an error
  // NOTE  HERE  make it possible to work with lower or upper case (not case sensitive)
  const existingUser = await knex.select('*').from('user_account').where('email', email).first();

  const hashedPassword = await bcrypt.hash(password, 8);

  if (existingUser) {
    throw new Error('nope, this email is already used buddy');
  }

  // NOTE  remove password from the return
  const user = await knex.insert({ email, password: hashedPassword }).into('user_account').returning('*');

  const token = jwt.sign({ id: user[0].id, email: user[0].email }, 'secret');
  console.log(token);

  res.status(201).send(user[0]);
};

// export const login = (req: Request, res: Response) => {};

// export const logout = (req: Request, res: Response) => {};
