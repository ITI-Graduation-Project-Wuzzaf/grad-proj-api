import { stripe } from '../utilities/stripe';

import { Request, Response } from 'express';

export const subscription = async (req: Request, res: Response) => {
  // const charge = await stripe.charges.create({
  //   currency: 'usd',
  //   // amount: order.price * 100,
  //   // source: token,
  // });
  // charge.id;
  res.send({});
};
