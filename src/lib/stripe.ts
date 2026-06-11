import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  appInfo: {
    name: 'N3xUs Konc3ptz',
    version: '1.0.0',
  },
});
