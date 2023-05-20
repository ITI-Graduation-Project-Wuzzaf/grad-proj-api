import { Request, Response } from 'express';

import * as crud from '../utilities/crud';

export const show = async (req: Request, res: Response) => {
  const id = +req.params.id;
  const profile = await crud.show('profile', id);
  res.send(profile);
};

export const update = async (req: Request, res: Response) => {
  const profile = await crud.update('profile', res.locals.userId, req.body);
  res.status(200).send(profile);
};
