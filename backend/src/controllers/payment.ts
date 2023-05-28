import { BadRequestError } from '../errors/BadRequestError';
import { stripe } from '../utilities/stripe';

import { Request, Response } from 'express';

export const paymentIntent = async (req: Request, res: Response) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: 9999,
    currency: 'usd',
    payment_method_types: ['card', 'paypal'],
  });

  res.json({ client_secret: paymentIntent.client_secret });
};

export const subscription = async (req: Request, res: Response) => {
  const { jobId, jobName } = req.body;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'paypal'],
    mode: 'payment',

    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: jobName,
            metadata: {
              id: jobId,
            },
          },
          unit_amount: 9999,
        },
        quantity: 1,
      },
    ],
    success_url: '/',
    cancel_url: '/dsadwqewqe',
  });
  res.json({ id: session.id });
};

export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const endPointSecret = process.env.STRIPE_WH + '';

  if (!sig) {
    throw new BadRequestError('Cannot proceed without signature');
  }

  let stripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(req.body, sig, endPointSecret);
  } catch (err) {
    throw new BadRequestError('An error occured while verifying the signature.');
  }

  console.log(stripeEvent.type);

  // console.log(stripeEvent.data.object);

  res.send({});
};
