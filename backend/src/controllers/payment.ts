import { BadRequestError } from '../errors/BadRequestError';
import { stripe } from '../utilities/stripe';

import { Request, Response } from 'express';

export const checkout = async (req: Request, res: Response) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'paypal'],
    mode: 'payment',
    metadata: {
      jobId: 123,
      aFieldToUseWhenTheUserPay: 'yea yea its me here huh',
    },

    line_items: [
      {
        price: 'price_1NCpCuEQc4Ij7mVsLbyYSyzo',
        quantity: 1,
      },
    ],
    success_url: 'http://localhost:5173/',
    cancel_url: 'http://localhost:5000/dsadwqewqe',
  });

  res.send({ sessionId: session.id });
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

  switch (stripeEvent.type) {
    case 'checkout.session.completed':
      console.log(stripeEvent.data.object);

      console.log('Remember to send a confirmation email and make the job become featured');

      break;
    default:
      throw new BadRequestError(`Unkown stripe event ${stripeEvent.type}}`);
  }

  res.send({});
};
