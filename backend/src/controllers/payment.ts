import Stripe from 'stripe';
import { BadRequestError } from '../errors/BadRequestError';
import { update } from '../utilities/crud';
import { stripe } from '../utilities/stripe';

import { Request, Response } from 'express';
import mail from '../utilities/mailing';
import * as notifications from '../utilities/notifications';

import { io } from '../utilities/socket';

interface IStripeEvent extends Stripe.Event {
  data: {
    object: {
      metadata?: { jobId: number; userId: number };
      customer_details?: { email: string };
    };
  };
}

export const checkout = async (req: Request, res: Response) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card', 'paypal'],
    mode: 'payment',
    metadata: {
      jobId: req.body.jobId,
      userId: res.locals.userId,
    },

    line_items: [
      {
        price: 'price_1NCpCuEQc4Ij7mVsLbyYSyzo',
        quantity: 1,
      },
    ],
    success_url: 'http://localhost:5173/',
    cancel_url: 'http://localhost:5173/?payment=failed',
  });

  res.send({ sessionId: session.id });
};

export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature'];
  const endPointSecret = process.env.STRIPE_WH + '';

  if (!sig) {
    throw new BadRequestError('Cannot proceed without signature');
  }

  let stripeEvent: IStripeEvent;
  try {
    stripeEvent = stripe.webhooks.constructEvent(req.body, sig, endPointSecret);
  } catch (err) {
    throw new BadRequestError('An error occured while verifying the signature.');
  }

  switch (stripeEvent.type) {
    case 'checkout.session.completed':
      if (stripeEvent.data.object.metadata && stripeEvent.data.object.customer_details) {
        const jobId = stripeEvent.data.object.metadata.jobId;
        await update('job', jobId, { featured: true });
        const userId = stripeEvent.data.object.metadata.userId;
        const url = `/jobDetails/${jobId}`;
        const content = 'Featured Job Payment Confirmation';
        const data = { content, url, recipient_id: userId, recipient_type: 'employer' };
        const notification = await notifications.create(data);

        io.to(`employer_${userId}`).emit('notification', notification);
        mail(stripeEvent.data.object.customer_details.email, 'Featured Job Payment Confirmation');
      }

      break;
    default:
      throw new BadRequestError(`Unkown stripe event ${stripeEvent.type}}`);
  }

  res.send({});
};
