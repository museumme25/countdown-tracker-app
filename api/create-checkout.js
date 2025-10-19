const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { currency } = req.body;
    
    const priceIds = {
      GBP: process.env.STRIPE_PRICE_GBP,
      EUR: process.env.STRIPE_PRICE_EUR,
      USD: process.env.STRIPE_PRICE_USD
    };

    const priceId = priceIds[currency];
    
    if (!priceId) {
      return res.status(400).json({ error: 'Invalid currency' });
    }

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin || 'https://countdown-tracker-app.vercel.app'}?success=true`,
      cancel_url: `${req.headers.origin || 'https://countdown-tracker-app.vercel.app'}?canceled=true`,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    res.status(500).json({ error: error.message });
  }
};