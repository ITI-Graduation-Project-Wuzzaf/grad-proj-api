import { Request, Response } from 'express';
import mail from '../utilities/mailing';

export const contactUs = async (req: Request, res: Response) => {
  const { name, email, message } = req.body;

  mail('baselsalah2053@gmail.com', email, 'Jobify is happy to have you', name, message);
  res.send({});
};
