const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { paymentIntentId, reason, refundAmount } = JSON.parse(event.body);

    if (!paymentIntentId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Payment Intent ID is required' })
      };
    }

    // Retrieve the payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    let result = {};

    // Handle based on payment status
    switch (paymentIntent.status) {
      case 'requires_capture':
        // Cancel uncaptured payment
        const canceledPayment = await stripe.paymentIntents.cancel(paymentIntentId, {
          cancellation_reason: reason || 'requested_by_customer'
        });
        result = {
          action: 'canceled',
          paymentIntent: canceledPayment
        };
        break;

      case 'succeeded':
        // Create refund for captured payment
        const refund = await stripe.refunds.create({
          payment_intent: paymentIntentId,
          amount: refundAmount || paymentIntent.amount, // Partial or full refund
          reason: reason || 'requested_by_customer',
          metadata: {
            original_session_date: paymentIntent.metadata.session_date,
            client_id: paymentIntent.metadata.client_id
          }
        });
        result = {
          action: 'refunded',
          refund: refund,
          paymentIntent: paymentIntent
        };
        break;

      case 'canceled':
        result = {
          action: 'already_canceled',
          paymentIntent: paymentIntent
        };
        break;

      default:
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'Payment cannot be canceled',
            status: paymentIntent.status
          })
        };
    }

    // Trigger N8N webhook
    if (process.env.N8N_PAYMENT_WEBHOOK) {
      try {
        await fetch(process.env.N8N_PAYMENT_WEBHOOK, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Token': process.env.N8N_WEBHOOK_TOKEN || ''
          },
          body: JSON.stringify({
            event: `payment.${result.action}`,
            paymentIntentId: paymentIntentId,
            action: result.action,
            reason: reason,
            refundAmount: refundAmount,
            clientId: paymentIntent.metadata.client_id,
            sessionDate: paymentIntent.metadata.session_date,
            timestamp: new Date().toISOString()
          })
        });
      } catch (webhookError) {
        console.error('Error triggering N8N webhook:', webhookError);
      }
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        success: true,
        ...result
      })
    };

  } catch (error) {
    console.error('Error canceling payment:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to cancel payment',
        details: error.message
      })
    };
  }
};