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
      priceId,
      clientId,
      sessionDate,
      packageType,
      paymentPlan,
      teamSize,
      customerEmail,
      customerName,
      successUrl,
      cancelUrl
    } = JSON.parse(event.body);

    // Calculate capture date (session date)
    const captureDate = new Date(sessionDate);
    const captureTimestamp = Math.floor(captureDate.getTime() / 1000);

    // Create checkout session with manual capture
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: paymentPlan && paymentPlan !== 'full' ? 'subscription' : 'payment',
      success_url: successUrl || process.env.STRIPE_SUCCESS_URL,
      cancel_url: cancelUrl || process.env.STRIPE_CANCEL_URL,
      customer_email: customerEmail,
      // Manual capture for one-time payments
      payment_intent_data: paymentPlan === 'full' || !paymentPlan ? {
        capture_method: 'manual',
        metadata: {
          client_id: clientId,
          session_date: sessionDate,
          package_type: packageType,
          capture_on: captureTimestamp.toString()
        }
      } : undefined,
      // Subscription data for payment plans
      subscription_data: paymentPlan && paymentPlan !== 'full' ? {
        metadata: {
          client_id: clientId,
          session_date: sessionDate,
          package_type: packageType,
          payment_plan: paymentPlan,
          team_size: teamSize || ''
        }
      } : undefined,
      metadata: {
        client_id: clientId,
        session_date: sessionDate,
        package_type: packageType,
        payment_plan: paymentPlan || 'full',
        team_size: teamSize || '',
        customer_name: customerName
      },
      // Invoice settings
      invoice_creation: {
        enabled: true,
        invoice_data: {
          custom_fields: [{
            name: 'Client ID',
            value: clientId
          }, {
            name: 'Session Date',
            value: sessionDate
          }],
          metadata: {
            client_id: clientId,
            session_date: sessionDate,
            package_type: packageType
          },
          rendering_options: {
            amount_tax_display: 'exclude_tax'
          }
        }
      },
      // Require billing address for better fraud prevention
      billing_address_collection: 'required',
      // Allow promotional codes
      allow_promotion_codes: true,
      // Tax calculation
      automatic_tax: {
        enabled: true
      }
    });

    // Return session details
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId: session.id,
        url: session.url,
        paymentIntentId: session.payment_intent,
        captureDate: sessionDate
      })
    };

  } catch (error) {
    console.error('Error creating checkout session:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to create checkout session',
        details: error.message
      })
    };
  }
};