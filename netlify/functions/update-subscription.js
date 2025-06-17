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
    const {
      subscriptionId,
      action,
      newPriceId,
      cancelAtPeriodEnd,
      pauseCollection,
      resumeAt
    } = JSON.parse(event.body);

    if (!subscriptionId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Subscription ID is required' })
      };
    }

    let updatedSubscription;

    switch (action) {
      case 'cancel':
        // Cancel subscription
        updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: cancelAtPeriodEnd !== false
        });
        break;

      case 'cancel_immediately':
        // Cancel immediately
        updatedSubscription = await stripe.subscriptions.del(subscriptionId);
        break;

      case 'reactivate':
        // Reactivate canceled subscription
        updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
          cancel_at_period_end: false
        });
        break;

      case 'pause':
        // Pause subscription
        updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
          pause_collection: {
            behavior: 'mark_uncollectible'
          }
        });
        break;

      case 'resume':
        // Resume paused subscription
        updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
          pause_collection: null
        });
        break;

      case 'update_price':
        // Update subscription price
        if (!newPriceId) {
          return {
            statusCode: 400,
            body: JSON.stringify({ error: 'New price ID is required for price update' })
          };
        }

        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
          items: [{
            id: subscription.items.data[0].id,
            price: newPriceId
          }],
          proration_behavior: 'create_prorations'
        });
        break;

      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: 'Invalid action' })
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
            event: `subscription.${action}`,
            subscriptionId: subscriptionId,
            action: action,
            status: updatedSubscription.status,
            customerId: updatedSubscription.customer,
            metadata: updatedSubscription.metadata,
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
        subscription: {
          id: updatedSubscription.id,
          status: updatedSubscription.status,
          cancel_at_period_end: updatedSubscription.cancel_at_period_end,
          current_period_end: updatedSubscription.current_period_end,
          customer: updatedSubscription.customer
        }
      })
    };

  } catch (error) {
    console.error('Error updating subscription:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to update subscription',
        details: error.message
      })
    };
  }
};