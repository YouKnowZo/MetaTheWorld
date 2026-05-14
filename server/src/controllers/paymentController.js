const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const prisma = require('../config/prisma');

exports.createCheckoutSession = async (req, res) => {
  try {
    const { amount, currency = 'usd' } = req.body;
    
    // Amount in cents (e.g., $10.00 = 1000)
    const amountInCents = Math.round(amount * 100);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: 'MTW Tokens Purchase',
              description: `Buying ${amount * 100} MTW Tokens`,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_URL}/dashboard?payment=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard?payment=cancel`,
      metadata: {
        userId: req.user.id,
        amount: amount,
        mtwAmount: amount * 100 // 1 USD = 100 MTW
      }
    });

    res.json({ id: session.id, url: session.url });
  } catch (err) {
    console.error('Stripe Session Error:', err);
    res.status(500).json({ error: 'Failed to create payment session' });
  }
};

exports.handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body, 
      sig, 
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // Update user balance and record transaction
    const userId = session.metadata.userId;
    const mtwAmount = parseFloat(session.metadata.mtwAmount);

    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: { balance: { increment: mtwAmount } }
      }),
      prisma.transaction.create({
        data: {
          userId,
          amount: mtwAmount,
          type: 'DEPOSIT',
          status: 'COMPLETED',
          stripeId: session.id,
          currency: 'MTW'
        }
      })
    ]);
    
    console.log(`✅ Payment Successful: ${mtwAmount} MTW added to User ${userId}`);
  }

  res.json({ received: true });
};
