
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

function createPaymentMethod(updateUserFunction, doneFunction) {
  stripe.createPaymentMethod('card', CARD, {
    billing_details: {
      email: window.lc.getData('user').userEmail,
    },
  }).then(function(result) {
    if(result.error) {
      console.error(result.error);
    } else if (result.paymentMethod) {
      updateUserFunction(result.paymentMethod.id)
    }
  });
}
let CARD;
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

  CARD = elements.create('card', {style: style});
  CARD.mount(id);
  CARD.addEventListener('change', ({error}) => {
    const displayError = document.getElementById('card-errors');
    if (error) {
      displayError.textContent = error.message;
    } else {
      displayError.textContent = '';
    }
  });
}

module.exports = {
  stripeRenderer,
  createPaymentMethod
}
