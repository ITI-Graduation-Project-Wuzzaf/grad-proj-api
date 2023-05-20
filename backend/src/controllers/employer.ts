import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import * as crud from '../utilities/crud';

const { JWT_SECRET, JWT_ACCESS_EXPIRY } = process.env;

export const show = async (req: Request, res: Response) => {
  const id = +req.params.id;
  const employer = await crud.show('employer', id);
  res.send(employer);
};

export const update = async (req: Request, res: Response) => {
  const employer = await crud.update('employer', res.locals.userId, req.body);
  res.status(200).send(employer[0]);
};

export const signup = async (req: Request, res: Response) => {
  const { confirmPassword, ...body } = req.body;
  const employer = await crud.signup('employer', body);

  const accessToken = jwt.sign({ id: employer[0].id, email: employer[0].email }, JWT_SECRET + '', {
    expiresIn: JWT_ACCESS_EXPIRY + '',
  });

  res.status(201).send({ employer: employer[0], accessToken });
};
