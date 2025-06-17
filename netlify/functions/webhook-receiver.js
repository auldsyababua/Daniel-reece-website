const Airtable = require('airtable');

// Configure CORS headers
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

// Webhook types and their handlers
const webhookHandlers = {
  // Handle Stripe webhook events
  'stripe.payment_intent.succeeded': async (data, base) => {
    // Create or update a payment record
    const paymentRecord = {
      'Payment ID': data.id,
      'Amount': data.amount / 100, // Convert from cents
      'Currency': data.currency.toUpperCase(),
      'Customer Email': data.receipt_email || data.billing_details?.email,
      'Status': 'Completed',
      'Payment Date': new Date().toISOString(),
      'Metadata': JSON.stringify(data.metadata || {}),
    };
    
    return await base('Payments').create([{ fields: paymentRecord }]);
  },
  
  // Handle calendar sync events from n8n
  'calendar.event.created': async (data, base) => {
    const sessionRecord = {
      'Client': data.clientEmail, // This should link to the Clients table
      'Date': data.eventDate,
      'Type': data.sessionType || 'Coaching Session',
      'Status': 'Scheduled',
      'Duration': data.duration || 60,
      'Location': data.location || 'Virtual',
      'Notes': data.notes || '',
      'Calendar Event ID': data.eventId,
    };
    
    return await base(process.env.AIRTABLE_SESSIONS_TABLE || 'Sessions').create([{ fields: sessionRecord }]);
  },
  
  // Handle form submissions from other sources
  'form.submission': async (data, base) => {
    const leadRecord = {
      'Name': data.name,
      'Email': data.email,
      'Source': data.source || 'External Form',
      'Message': data.message,
      'Form Type': data.formType,
      'Submission Date': new Date().toISOString(),
    };
    
    return await base(process.env.AIRTABLE_LEADS_TABLE || 'Leads').create([{ fields: leadRecord }]);
  },
  
  // Handle custom n8n workflows
  'n8n.workflow.complete': async (data, base) => {
    // Log workflow completions for monitoring
    console.log('n8n workflow completed:', data.workflowName, data.executionId);
    return { success: true, logged: true };
  },
};

exports.handler = async (event, context) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Verify webhook token if configured
    const webhookToken = process.env.N8N_WEBHOOK_TOKEN;
    if (webhookToken) {
      const authHeader = event.headers.authorization;
      const providedToken = event.headers['x-webhook-token'] || 
                           (authHeader && authHeader.replace('Bearer ', ''));
      
      if (!providedToken || providedToken !== webhookToken) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Unauthorized' }),
        };
      }
    }
    
    // Parse request body
    const data = JSON.parse(event.body);
    
    // Extract webhook type and payload
    const webhookType = data.type || data.event || 'unknown';
    const payload = data.payload || data;
    
    console.log(`Received webhook: ${webhookType}`);
    
    // Initialize Airtable if needed
    let base = null;
    if (process.env.AIRTABLE_API_KEY && process.env.AIRTABLE_BASE_ID) {
      base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY })
        .base(process.env.AIRTABLE_BASE_ID);
    }
    
    // Process webhook based on type
    let result = { received: true };
    
    if (webhookHandlers[webhookType] && base) {
      try {
        result = await webhookHandlers[webhookType](payload, base);
        console.log(`Webhook ${webhookType} processed successfully`);
      } catch (handlerError) {
        console.error(`Error in webhook handler ${webhookType}:`, handlerError);
        result.error = handlerError.message;
      }
    } else {
      // Log unhandled webhook types for future implementation
      console.log(`Unhandled webhook type: ${webhookType}`);
      result.unhandled = true;
    }
    
    // Store raw webhook data for debugging/replay if configured
    if (process.env.STORE_RAW_WEBHOOKS === 'true' && base) {
      try {
        await base('Webhooks').create([{
          fields: {
            'Type': webhookType,
            'Payload': JSON.stringify(payload),
            'Received At': new Date().toISOString(),
            'Processed': !!webhookHandlers[webhookType],
            'Result': JSON.stringify(result),
          },
        }]);
      } catch (storeError) {
        console.error('Error storing webhook:', storeError);
      }
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        type: webhookType,
        result,
        timestamp: new Date().toISOString(),
      }),
    };
    
  } catch (error) {
    console.error('Webhook receiver error:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Failed to process webhook',
        message: error.message,
      }),
    };
  }
};