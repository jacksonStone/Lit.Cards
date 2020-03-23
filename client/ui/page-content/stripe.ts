let stripe: StripeAPI;
declare const STRIPE_PUBLIC_KEY: string;
declare const URL_ROOT: string;

import { request } from '../../browser-abstractions/request';
async function initializeStripe() {
  if (stripe) return true;
  while (!window.Stripe) {
    await new Promise(resolve => setTimeout(resolve, 20));
  }
  stripe = window.Stripe(STRIPE_PUBLIC_KEY);
}

async function createStripeCheckoutSession(monthDuration: number) {
  await initializeStripe();
  const session = await request((URL_ROOT || '') + '/api/stripe/checkout', {month_duration: monthDuration});
  const sessionObj = JSON.parse(session);
  stripe.redirectToCheckout({
    sessionId: sessionObj.id
  })
}

export {
  createStripeCheckoutSession,
};
