const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event, context) => {
  // Only allow POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  // Verify webhook token if provided
  const webhookToken = event.headers['x-webhook-token'];
  if (process.env.N8N_WEBHOOK_TOKEN && webhookToken !== process.env.N8N_WEBHOOK_TOKEN) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }

  try {
    const { paymentIntentId, clientId, sessionDate } = JSON.parse(event.body);

    if (!paymentIntentId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Payment Intent ID is required' })
      };
    }

    // Retrieve the payment intent
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    // Check if already captured
    if (paymentIntent.status === 'succeeded') {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: 'Payment already captured',
          paymentIntent: {
            id: paymentIntent.id,
            amount: paymentIntent.amount,
            status: paymentIntent.status,
            metadata: paymentIntent.metadata
          }
        })
      };
    }

    // Check if payment can be captured
    if (paymentIntent.status !== 'requires_capture') {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Payment cannot be captured',
          status: paymentIntent.status
        })
      };
    }

    // Capture the payment
    const capturedPayment = await stripe.paymentIntents.capture(paymentIntentId, {
      metadata: {
        ...paymentIntent.metadata,
        captured_on: new Date().toISOString(),
        captured_for_session: sessionDate
      }
    });

    // Generate invoice if payment successful
    let invoice = null;
    if (capturedPayment.status === 'succeeded' && capturedPayment.invoice) {
      try {
        // Retrieve the invoice
        invoice = await stripe.invoices.retrieve(capturedPayment.invoice);
        
        // Send the invoice
        if (invoice.status === 'draft') {
          invoice = await stripe.invoices.sendInvoice(capturedPayment.invoice);
        }
      } catch (invoiceError) {
        console.error('Error handling invoice:', invoiceError);
      }
    }

    // Trigger N8N webhook for successful capture
    if (capturedPayment.status === 'succeeded' && process.env.N8N_PAYMENT_WEBHOOK) {
      try {
        await fetch(process.env.N8N_PAYMENT_WEBHOOK, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Token': process.env.N8N_WEBHOOK_TOKEN || ''
          },
          body: JSON.stringify({
            event: 'payment.captured',
            paymentIntentId: capturedPayment.id,
            amount: capturedPayment.amount,
            clientId: clientId || capturedPayment.metadata.client_id,
            sessionDate: sessionDate || capturedPayment.metadata.session_date,
            invoiceId: invoice?.id,
            invoiceUrl: invoice?.hosted_invoice_url,
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
        paymentIntent: {
          id: capturedPayment.id,
          amount: capturedPayment.amount,
          status: capturedPayment.status,
          metadata: capturedPayment.metadata
        },
        invoice: invoice ? {
          id: invoice.id,
          url: invoice.hosted_invoice_url,
          pdf: invoice.invoice_pdf,
          status: invoice.status
        } : null
      })
    };

  } catch (error) {
    console.error('Error capturing payment:', error);
    
    // Trigger error webhook
    if (process.env.N8N_ERROR_WEBHOOK) {
      try {
        await fetch(process.env.N8N_ERROR_WEBHOOK, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Token': process.env.N8N_WEBHOOK_TOKEN || ''
          },
          body: JSON.stringify({
            event: 'payment.capture.failed',
            error: error.message,
            paymentIntentId: JSON.parse(event.body).paymentIntentId,
            timestamp: new Date().toISOString()
          })
        });
      } catch (webhookError) {
        console.error('Error triggering error webhook:', webhookError);
      }
    }

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to capture payment',
        details: error.message
      })
    };
  }
};