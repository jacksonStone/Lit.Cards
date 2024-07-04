let express = require('express')
let router = express.Router()
let code = require('../../node-abstractions/response-codes')
let { UNSAFE_USER, UNSAFE_setMisc, UNSAFE_USER_BY_CUSTOMER_ID } = require('../../buisness-logic/users/userDetails')
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const line_items_by_month = require('../../../shared/month-cataloge');
let baseURL = process.env.CARDS_SITE_DOMAIN_ROOT;
/**
 *
 *
 * REMEMBER when testing you will need to run ngrok and make sure Stripe
 * has that configured as the URL for the session.Completed webhook
 *
 */
router.post('/checkout', async (req, res) => {
    if (!req.userEmail) {
        return code.unauthorized(res)
    }
    if (!req.user.verifiedEmail) {
        return code.unauthorized(res)
    }
    if(!req.body) {
        return code.invalidRequest(res);
    }
    if(!req.body.month_duration){
        return code.invalidRequest(res);
    }
    const month_duration = req.body.month_duration;
    let line_item;
    if(line_items_by_month[month_duration + '']) {
        line_item = line_items_by_month[month_duration + ''];
    }
    if(!line_item) {
        return code.invalidRequest(res);
    }
    const current_user = await UNSAFE_USER(req.userEmail);
    if(!current_user.verifiedEmail) {
        return code.unauthorized(res);
    }

    const session_request = {
        payment_method_types: ['card'],
        line_items: [{
          name: line_item.name,
          description: line_item.description,
          images: [baseURL + '/static-images/stripe-image.png'],
          amount: line_item.price,
          currency: 'usd',
          quantity: 1,
        }],
        payment_intent_data: {
          capture_method: 'automatic',
        },
        mode: 'payment',
        success_url: process.env.CARDS_SITE_DOMAIN_ROOT + '/site/me',
        cancel_url: process.env.CARDS_SITE_DOMAIN_ROOT + '/site/me/settings#plan-details',
      };
    if(current_user.stripeCustomerId) {
        session_request.customer = current_user.stripeCustomerId;
    } else {
        const customer = await stripe.customers.create({email: req.userEmail});
        session_request.customer = customer.id;
        await UNSAFE_setMisc(req.userEmail, {stripeCustomerId: customer.id})

    }
    const session = await stripe.checkout.sessions.create(session_request);
    res.send(session);
});
/**
 * This is what confirms a purchase from stripe
 * @param {Stripe Session Object} session
 */
async function handleCheckoutSession(session) {
    if(!session.customer) {
        throw Error('Customer must be attached to the checkout');
    }
    const current_user = await UNSAFE_USER_BY_CUSTOMER_ID(session.customer);
    if(!current_user) {
        throw Error('No User with that customer id');
    }
    if(current_user.stripeLastProcessedSessionId == session.id) {
        return; // We've already processed this.
    }
    const name = session.display_items[0].custom.name;
    const months_purchased = (name.split(' ')[0])|0;
    const now = new Date();
    let months_in_advanced;
    if(!current_user.planExpiration || current_user.planExpiration < now.getTime()) {
        months_in_advanced = new Date();
    } else {
        //Had time left, add to their existing time
        months_in_advanced = new Date(current_user.planExpiration);
    }

    months_in_advanced.setMonth(months_in_advanced.getMonth() + months_purchased);
    await UNSAFE_setMisc(current_user.userEmail, {
        planExpiration: months_in_advanced.getTime(),
        stripeLastProcessedSessionId: session.id,
        trialUser:false
    });
}

module.exports = {router, handleCheckoutSession};
