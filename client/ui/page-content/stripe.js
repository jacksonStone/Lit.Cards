
let stripe;
async function initializeStripe() {
  if (stripe) return true;
  while (!window.Stripe) {
    await new Promise(resolve => setTimeout(resolve, 20));
  }
  console.log(STRIPE_PUBLIC_KEY);
  stripe = Stripe(STRIPE_PUBLIC_KEY);
}

async function stripeRenderer(id, subscribed) {
  await initializeStripe();
  if(subscribed) {
    return renderEditCardInfo(id);
  }
  return renderNewCardInfo(id);
}

function renderEditCardInfo(id) {
  //TODO
}
function renderNewCardInfo(id) {
  let elements = stripe.elements();
  let style = {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  };

  let card = elements.create('card', {style: style});
  card.mount(id);
}

module.exports = {
  stripeRenderer
}
