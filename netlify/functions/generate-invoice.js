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
      customerId,
      clientId,
      sessionDate,
      packageType,
      amount,
      description,
      items,
      dueDate,
      metadata
    } = JSON.parse(event.body);

    // Create or retrieve customer
    let customer;
    if (customerId) {
      customer = await stripe.customers.retrieve(customerId);
    } else {
      // Search for customer by metadata
      const customers = await stripe.customers.search({
        query: `metadata['client_id']:'${clientId}'`,
        limit: 1
      });
      
      customer = customers.data[0];
    }

    if (!customer) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Customer not found' })
      };
    }

    // Create invoice items if provided
    const invoiceItems = items || [{
      description: description || `${packageType} - Session ${sessionDate}`,
      amount: amount,
      currency: 'usd'
    }];

    // Create the invoice
    const invoice = await stripe.invoices.create({
      customer: customer.id,
      auto_advance: false, // Don't auto-finalize
      collection_method: 'send_invoice',
      days_until_due: dueDate ? Math.ceil((new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24)) : 7,
      custom_fields: [
        {
          name: 'Client ID',
          value: clientId
        },
        {
          name: 'Session Date',
          value: sessionDate
        },
        {
          name: 'Package Type',
          value: packageType
        }
      ],
      metadata: {
        client_id: clientId,
        session_date: sessionDate,
        package_type: packageType,
        ...metadata
      },
      rendering_options: {
        amount_tax_display: 'exclude_tax'
      },
      // Add prefix if configured
      ...(process.env.STRIPE_INVOICE_PREFIX && {
        custom_fields: [{
          name: 'Invoice Number',
          value: `${process.env.STRIPE_INVOICE_PREFIX}-${Date.now()}`
        }]
      })
    });

    // Add invoice items
    for (const item of invoiceItems) {
      await stripe.invoiceItems.create({
        customer: customer.id,
        invoice: invoice.id,
        description: item.description,
        amount: item.amount,
        currency: item.currency || 'usd',
        tax_rates: process.env.STRIPE_TAX_RATE_ID ? [process.env.STRIPE_TAX_RATE_ID] : undefined
      });
    }

    // Finalize the invoice
    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id, {
      auto_advance: true // This will send the invoice
    });

    // Send the invoice
    const sentInvoice = await stripe.invoices.sendInvoice(finalizedInvoice.id);

    // Trigger N8N webhook for invoice created
    if (process.env.N8N_PAYMENT_WEBHOOK) {
      try {
        await fetch(process.env.N8N_PAYMENT_WEBHOOK, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Webhook-Token': process.env.N8N_WEBHOOK_TOKEN || ''
          },
          body: JSON.stringify({
            event: 'invoice.created',
            invoiceId: sentInvoice.id,
            invoiceNumber: sentInvoice.number,
            customerId: sentInvoice.customer,
            amount: sentInvoice.amount_due,
            dueDate: new Date(sentInvoice.due_date * 1000).toISOString(),
            invoiceUrl: sentInvoice.hosted_invoice_url,
            invoicePdf: sentInvoice.invoice_pdf,
            clientId: clientId,
            sessionDate: sessionDate,
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
        invoice: {
          id: sentInvoice.id,
          number: sentInvoice.number,
          status: sentInvoice.status,
          amount_due: sentInvoice.amount_due,
          due_date: new Date(sentInvoice.due_date * 1000).toISOString(),
          url: sentInvoice.hosted_invoice_url,
          pdf: sentInvoice.invoice_pdf
        }
      })
    };

  } catch (error) {
    console.error('Error generating invoice:', error);
    
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Failed to generate invoice',
        details: error.message
      })
    };
  }
};