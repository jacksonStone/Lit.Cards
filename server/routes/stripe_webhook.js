//Had to put this in its own area so that bodyParser would not get used on it

let express = require('express')
let router = express.Router()
let bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_PRIVATE_KEY);
const {handleCheckoutSession} = require('./api/stripe');

//Need to use ngrok locally to test this B.S.
router.post('/api/stripe/webhook', bodyParser.raw({type: 'application/json'}), async (req, res) => {
    //process.env.STRIPE_WEBHOOK_SECRET
        const sig = req.headers['stripe-signature'];
        console.log(sig,process.env.STRIPE_WEBHOOK_SECRET);
        let event;
        try {
          event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            console.log(err.message);
          return res.status(400).send(`Webhook Error: ${err.message}`);
        }
      
        // Handle the checkout.session.completed event
        if (event.type === 'checkout.session.completed') {
          const session = event.data.object;
          // Fulfill the purchase...
          try {
            await handleCheckoutSession(session);
          }
          catch(e) {
            console.log(e);
            return res.status(400).send(`Webhook Error: ${e}`);
          }
        }
      
        // Return a response to acknowledge receipt of the event
        res.json({received: true});
      
});


module.exports = router;