const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const sig = event.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing signature or webhook secret' })
    };
  }

  let stripeEvent;

  try {
    // Verify webhook signature
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      sig,
      webhookSecret
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: `Webhook Error: ${err.message}` })
    };
  }

  // Handle the event
  try {
    switch (stripeEvent.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(stripeEvent.data.object);
        break;

      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(stripeEvent.data.object);
        break;

      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(stripeEvent.data.object);
        break;

      case 'invoice.paid':
        await handleInvoicePaid(stripeEvent.data.object);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(stripeEvent.data.object);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(stripeEvent.data.object);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(stripeEvent.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${stripeEvent.type}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ received: true })
    };

  } catch (error) {
    console.error('Error handling webhook:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Webhook handler failed' })
    };
  }
};

async function handleCheckoutSessionCompleted(session) {
  console.log('Checkout session completed:', session.id);
  
  // Trigger N8N webhook
  if (process.env.N8N_BOOKING_WEBHOOK) {
    await triggerN8NWebhook(process.env.N8N_BOOKING_WEBHOOK, {
      event: 'checkout.completed',
      sessionId: session.id,
      paymentIntentId: session.payment_intent,
      subscriptionId: session.subscription,
      customerId: session.customer,
      customerEmail: session.customer_email,
      amount: session.amount_total,
      metadata: session.metadata,
      mode: session.mode,
      paymentStatus: session.payment_status
    });
  }
}

async function handlePaymentIntentSucceeded(paymentIntent) {
  console.log('Payment intent succeeded:', paymentIntent.id);
  
  // This fires when payment is captured (for manual capture)
  if (process.env.N8N_PAYMENT_WEBHOOK) {
    await triggerN8NWebhook(process.env.N8N_PAYMENT_WEBHOOK, {
      event: 'payment.succeeded',
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      metadata: paymentIntent.metadata,
      captureMethod: paymentIntent.capture_method,
      chargeId: paymentIntent.latest_charge
    });
  }
}

async function handlePaymentIntentFailed(paymentIntent) {
  console.log('Payment intent failed:', paymentIntent.id);
  
  if (process.env.N8N_ERROR_WEBHOOK) {
    await triggerN8NWebhook(process.env.N8N_ERROR_WEBHOOK, {
      event: 'payment.failed',
      paymentIntentId: paymentIntent.id,
      amount: paymentIntent.amount,
      metadata: paymentIntent.metadata,
      error: paymentIntent.last_payment_error
    });
  }
}

async function handleInvoicePaid(invoice) {
  console.log('Invoice paid:', invoice.id);
  
  if (process.env.N8N_PAYMENT_WEBHOOK) {
    await triggerN8NWebhook(process.env.N8N_PAYMENT_WEBHOOK, {
      event: 'invoice.paid',
      invoiceId: invoice.id,
      customerId: invoice.customer,
      subscriptionId: invoice.subscription,
      amount: invoice.amount_paid,
      invoiceUrl: invoice.hosted_invoice_url,
      invoicePdf: invoice.invoice_pdf,
      metadata: invoice.metadata
    });
  }
}

async function handleInvoicePaymentFailed(invoice) {
  console.log('Invoice payment failed:', invoice.id);
  
  if (process.env.N8N_ERROR_WEBHOOK) {
    await triggerN8NWebhook(process.env.N8N_ERROR_WEBHOOK, {
      event: 'invoice.payment_failed',
      invoiceId: invoice.id,
      customerId: invoice.customer,
      subscriptionId: invoice.subscription,
      amount: invoice.amount_due,
      attemptCount: invoice.attempt_count,
      nextPaymentAttempt: invoice.next_payment_attempt
    });
  }
}

async function handleSubscriptionUpdate(subscription) {
  console.log('Subscription updated:', subscription.id);
  
  if (process.env.N8N_PAYMENT_WEBHOOK) {
    await triggerN8NWebhook(process.env.N8N_PAYMENT_WEBHOOK, {
      event: 'subscription.updated',
      subscriptionId: subscription.id,
      customerId: subscription.customer,
      status: subscription.status,
      currentPeriodEnd: subscription.current_period_end,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      metadata: subscription.metadata,
      items: subscription.items.data.map(item => ({
        priceId: item.price.id,
        quantity: item.quantity
      }))
    });
  }
}

async function handleSubscriptionCanceled(subscription) {
  console.log('Subscription canceled:', subscription.id);
  
  if (process.env.N8N_PAYMENT_WEBHOOK) {
    await triggerN8NWebhook(process.env.N8N_PAYMENT_WEBHOOK, {
      event: 'subscription.canceled',
      subscriptionId: subscription.id,
      customerId: subscription.customer,
      canceledAt: subscription.canceled_at,
      metadata: subscription.metadata
    });
  }
}

async function triggerN8NWebhook(url, data) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Webhook-Token': process.env.N8N_WEBHOOK_TOKEN || ''
      },
      body: JSON.stringify({
        ...data,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`N8N webhook failed: ${response.status}`);
    }
  } catch (error) {
    console.error('Error triggering N8N webhook:', error);
  }
}