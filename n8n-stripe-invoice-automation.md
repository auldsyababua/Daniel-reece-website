# Stripe Invoice Automation with n8n

## Overview
This guide sets up automated invoice processing using Stripe (test mode) and n8n workflow automation.

## Architecture

```
Stripe (Test Mode) → Webhook → n8n → Processing → Notifications/Actions
```

## Step 1: n8n Webhook Setup

### Create Webhook Workflow in n8n

1. **Log into your n8n instance**: https://n8n-rrrs.sliplane.app

2. **Create a new workflow** called "Stripe Invoice Handler"

3. **Add Webhook Node**:
   - Type: Webhook
   - HTTP Method: POST
   - Path: `/stripe-invoices`
   - Response Mode: "When Last Node Finishes"
   - Response Data: "First Entry JSON"

4. **Get your webhook URL**:
   ```
   https://n8n-rrrs.sliplane.app/webhook/stripe-invoices
   ```

## Step 2: Stripe Webhook Configuration

### In Stripe Dashboard (Test Mode)

1. Go to **Developers** → **Webhooks**
2. Click **"Add endpoint"**
3. Enter your n8n webhook URL
4. Select events to listen for:
   - `invoice.created`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `invoice.sent`
   - `invoice.finalized`
   - `invoice.updated`
   - `invoice.voided`

5. Copy the **Webhook Signing Secret** (starts with `whsec_test_...`)

## Step 3: n8n Workflow Configuration

### Complete Invoice Processing Workflow

```json
{
  "name": "Stripe Invoice Handler",
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "position": [250, 300],
      "webhookId": "stripe-invoices",
      "parameters": {
        "REDACTED_AIRTABLE_PAT": "stripe-invoices",
        "responseMode": "onReceived",
        "responseData": "allEntries"
      }
    },
    {
      "name": "Verify Stripe Signature",
      "type": "n8n-nodes-base.function",
      "position": [450, 300],
      "parameters": {
        "functionCode": "// Verify webhook signature\nconst stripe = require('stripe');\nconst endpointSecret = 'whsec_test_YOUR_SECRET';\n\ntry {\n  const sig = $input.headers['stripe-signature'];\n  const event = stripe.webhooks.constructEvent(\n    $input.body,\n    sig,\n    endpointSecret\n  );\n  return { json: event };\n} catch (err) {\n  throw new Error(`Webhook Error: ${err.message}`);\n}"
      }
    },
    {
      "name": "Route by Event Type",
      "type": "n8n-nodes-base.switch",
      "position": [650, 300],
      "parameters": {
        "dataPropertyName": "type",
        "values": {
          "string": [
            {"value": "invoice.created"},
            {"value": "invoice.payment_succeeded"},
            {"value": "invoice.payment_failed"},
            {"value": "invoice.sent"},
            {"value": "invoice.finalized"}
          ]
        }
      }
    },
    {
      "name": "Process New Invoice",
      "type": "n8n-nodes-base.function",
      "position": [850, 100],
      "parameters": {
        "functionCode": "// Process newly created invoice\nconst invoice = $input.data;\n\nreturn {\n  json: {\n    action: 'new_invoice',\n    invoice_id: invoice.id,\n    customer_id: invoice.customer,\n    amount: invoice.amount_due / 100,\n    currency: invoice.currency,\n    status: invoice.status,\n    due_date: new Date(invoice.due_date * 1000).toISOString(),\n    invoice_url: invoice.hosted_invoice_url,\n    pdf_url: invoice.invoice_pdf,\n    items: invoice.lines.data.map(item => ({\n      description: item.description,\n      amount: item.amount / 100,\n      quantity: item.quantity\n    }))\n  }\n};"
      }
    },
    {
      "name": "Handle Payment Success",
      "type": "n8n-nodes-base.function",
      "position": [850, 200],
      "parameters": {
        "functionCode": "// Handle successful payment\nconst invoice = $input.data;\n\nreturn {\n  json: {\n    action: 'payment_success',\n    invoice_id: invoice.id,\n    customer_id: invoice.customer,\n    amount_paid: invoice.amount_paid / 100,\n    payment_date: new Date().toISOString(),\n    receipt_url: invoice.receipt_url\n  }\n};"
      }
    },
    {
      "name": "Handle Payment Failure",
      "type": "n8n-nodes-base.function",
      "position": [850, 300],
      "parameters": {
        "functionCode": "// Handle failed payment\nconst invoice = $input.data;\n\nreturn {\n  json: {\n    action: 'payment_failed',\n    invoice_id: invoice.id,\n    customer_id: invoice.customer,\n    amount_due: invoice.amount_due / 100,\n    attempt_count: invoice.attempt_count,\n    next_attempt: invoice.next_payment_attempt ? new Date(invoice.next_payment_attempt * 1000).toISOString() : null\n  }\n};"
      }
    },
    {
      "name": "Update Airtable",
      "type": "n8n-nodes-base.airtable",
      "position": [1050, 200],
      "parameters": {
        "operation": "create",
        "table": "Invoices",
        "fields": {
          "Invoice ID": "={{$json.invoice_id}}",
          "Customer ID": "={{$json.customer_id}}",
          "Amount": "={{$json.amount}}",
          "Status": "={{$json.action}}",
          "Date": "={{$json.payment_date || $json.due_date}}",
          "URL": "={{$json.invoice_url || $json.receipt_url}}"
        }
      }
    },
    {
      "name": "Send Email Notification",
      "type": "n8n-nodes-base.emailSend",
      "position": [1250, 200],
      "parameters": {
        "fromEmail": "invoices@yourdomain.com",
        "toEmail": "admin@yourdomain.com",
        "subject": "Invoice {{$json.action}}: {{$json.invoice_id}}",
        "text": "Invoice {{$json.invoice_id}} status: {{$json.action}}\\n\\nAmount: ${{$json.amount}}\\nCustomer: {{$json.customer_id}}\\n\\nView Invoice: {{$json.invoice_url}}"
      }
    }
  ]
}
```

## Step 4: Advanced Automation Features

### 1. Automatic Invoice Creation

Create a workflow to automatically generate invoices:

```javascript
// n8n Function Node: Create Monthly Invoices
const stripe = require('stripe')('sk_test_YOUR_KEY');

// Get active subscriptions
const subscriptions = await stripe.subscriptions.list({
  status: 'active',
  limit: 100
});

// Create invoices
for (const subscription of subscriptions.data) {
  const invoice = await stripe.invoices.create({
    customer: subscription.customer,
    subscription: subscription.id,
    auto_advance: true, // Auto-finalize
    collection_method: 'charge_automatically',
    description: `Monthly service - ${new Date().toLocaleDateString()}`,
    metadata: {
      workflow: 'n8n_automation',
      generated_at: new Date().toISOString()
    }
  });
  
  // Finalize and send
  await stripe.invoices.finalizeInvoice(invoice.id);
  await stripe.invoices.sendInvoice(invoice.id);
}

return { json: { processed: subscriptions.data.length } };
```

### 2. Payment Reminder Automation

```javascript
// n8n Function Node: Send Payment Reminders
const stripe = require('stripe')('sk_test_YOUR_KEY');

// Get overdue invoices
const invoices = await stripe.invoices.list({
  status: 'open',
  due_date: {
    lt: Math.floor(Date.now() / 1000) // Past due
  }
});

const reminders = [];
for (const invoice of invoices.data) {
  // Calculate days overdue
  const daysOverdue = Math.floor(
    (Date.now() - invoice.due_date * 1000) / (1000 * 60 * 60 * 24)
  );
  
  if (daysOverdue === 3 || daysOverdue === 7 || daysOverdue === 14) {
    // Send reminder
    reminders.push({
      invoice_id: invoice.id,
      customer_email: invoice.customer_email,
      amount_due: invoice.amount_due / 100,
      days_overdue: daysOverdue,
      payment_url: invoice.hosted_invoice_url
    });
  }
}

return { json: reminders };
```

### 3. Dunning Management

```javascript
// n8n Function Node: Dunning Process
const stripe = require('stripe')('sk_test_YOUR_KEY');

async function handleDunning(invoice) {
  const attemptCount = invoice.attempt_count;
  
  if (attemptCount === 1) {
    // First failure - send friendly reminder
    return {
      action: 'friendly_reminder',
      template: 'payment_retry_1'
    };
  } else if (attemptCount === 2) {
    // Second failure - urgent notice
    return {
      action: 'urgent_notice',
      template: 'payment_retry_2'
    };
  } else if (attemptCount === 3) {
    // Third failure - final warning
    return {
      action: 'final_warning',
      template: 'payment_retry_3'
    };
  } else {
    // Max attempts - suspend service
    await stripe.subscriptions.update(invoice.subscription, {
      pause_collection: {
        behavior: 'mark_uncollectible'
      }
    });
    
    return {
      action: 'service_suspended',
      template: 'account_suspended'
    };
  }
}
```

## Step 5: Testing the Automation

### Create Test Data in Stripe

1. **Create test customer**:
```bash
curl https://api.stripe.com/v1/customers \
  -u sk_test_YOUR_KEY: \
  -d email="test@example.com" \
  -d description="Test Customer for n8n"
```

2. **Create test invoice**:
```bash
curl https://api.stripe.com/v1/invoices \
  -u sk_test_YOUR_KEY: \
  -d customer="cus_TEST_ID" \
  -d auto_advance=true
```

3. **Add invoice items**:
```bash
curl https://api.stripe.com/v1/invoiceitems \
  -u sk_test_YOUR_KEY: \
  -d customer="cus_TEST_ID" \
  -d amount=2000 \
  -d currency=usd \
  -d description="Test Service"
```

4. **Trigger webhook events** using Stripe CLI:
```bash
stripe trigger invoice.payment_succeeded --stripe-account sk_test_YOUR_KEY
```

## Step 6: Monitoring and Debugging

### n8n Execution Logs

Monitor workflow executions in n8n:
1. Go to **Workflow** → **Executions**
2. Check for successful/failed runs
3. View detailed logs for each node

### Stripe Webhook Logs

Check webhook deliveries in Stripe:
1. Go to **Developers** → **Webhooks**
2. Click on your endpoint
3. View **"Webhook attempts"**
4. Check response codes and retry attempts

## Step 7: Production Considerations

### Before Going Live

1. **Replace test keys** with production keys:
   - Update `sk_test_` → `sk_live_`
   - Update `whsec_test_` → `whsec_`

2. **Set up error handling**:
   - Add try-catch blocks
   - Configure retry logic
   - Set up alerting for failures

3. **Security measures**:
   - Verify webhook signatures
   - Use environment variables for keys
   - Implement rate limiting

4. **Backup and recovery**:
   - Store invoice data in database
   - Implement idempotency
   - Set up webhook replay capability

## Automation Templates

### Template 1: Subscription Billing

Automatically bill customers on a schedule:
- Monthly/annual billing cycles
- Proration handling
- Usage-based billing
- Trial period management

### Template 2: Late Payment Recovery

Recover failed payments automatically:
- Smart retry schedule
- Payment method updates
- Customer communication
- Escalation workflow

### Template 3: Invoice Reconciliation

Sync invoices with accounting:
- Export to QuickBooks/Xero
- Generate reports
- Tax calculation
- Revenue recognition

## Troubleshooting

### Common Issues

1. **Webhook not receiving events**:
   - Check n8n webhook URL is accessible
   - Verify Stripe endpoint is active
   - Check firewall/security settings

2. **Signature verification failing**:
   - Ensure correct webhook secret
   - Check raw body vs parsed JSON
   - Verify header format

3. **Invoice creation errors**:
   - Validate customer exists
   - Check required fields
   - Verify API permissions

## Next Steps

1. Customize email templates
2. Add SMS notifications
3. Integrate with CRM (HubSpot/Salesforce)
4. Set up analytics dashboard
5. Implement custom billing logic

## Resources

- [Stripe Invoice API](https://stripe.com/docs/api/invoices)
- [n8n Documentation](https://docs.n8n.io)
- [Webhook Best Practices](https://stripe.com/docs/webhooks/best-practices)
- [Testing Guide](https://stripe.com/docs/testing)