# Zapier Backup Solution for Stripe Invoice Automation

## Overview

Since the n8n webhook endpoint is currently experiencing routing issues, this document provides a complete Zapier-based backup solution that can be implemented immediately to handle Stripe invoice automation.

## 🚀 Quick Setup Guide

### Step 1: Create Zapier Webhook Trigger

1. **Go to Zapier** → Create New Zap
2. **Trigger**: Webhooks by Zapier
   - **Event**: Catch Hook
   - **Copy the webhook URL** (will be something like `https://hooks.zapier.com/hooks/catch/...`)

### Step 2: Configure Stripe Webhook in Dashboard

1. **Go to Stripe Dashboard** → Webhooks
2. **Add Endpoint**: Paste the Zapier webhook URL
3. **Select Events**:
   - `invoice.created`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
   - `invoice.sent`
   - `invoice.finalized`
4. **Save** and copy the **Webhook Signing Secret**

### Step 3: Set Up Zapier Workflow

#### Filter Step (Optional but Recommended)
- **App**: Filter by Zapier
- **Condition**: `type` contains any of:
  - `invoice.created`
  - `invoice.payment_succeeded`
  - `invoice.payment_failed`
  - `invoice.sent`
  - `invoice.finalized`

#### Transform Data Step
- **App**: Formatter by Zapier
- **Transform**: Multiple Text operations
  - Extract invoice ID: `{{data__object__id}}`
  - Convert amount: `{{data__object__amount_due / 100}}`
  - Map status: Use lookup table:
    - `paid` → `Paid`
    - `open` → `Pending`
    - `draft` → `Pending`
    - Other → `Overdue`

#### Airtable Integration
- **App**: Airtable
- **Action**: Create Record
- **Base**: Select "Daniel Reece Coaching" base
- **Table**: "Invoices"
- **Field Mapping**:
  - **Invoice Number**: `{{data__object__id}}`
  - **Amount Due**: `{{formatted_amount}}` (from transformer)
  - **Status**: `{{mapped_status}}` (from transformer)
  - **Invoice Date**: `{{data__object__created}}` (formatted)
  - **Services Provided**: `{{data__object__description}}`
  - **Notes**: `Stripe Event: {{type}} | Customer: {{data__object__customer_email}} | Received: {{zap_meta_timestamp}}`

#### Email Notification (Conditional)
- **App**: Filter by Zapier
  - **Condition**: `type` equals `invoice.payment_succeeded` OR `invoice.payment_failed`
- **App**: Gmail
- **Action**: Send Email
- **To**: `daniel@danielreece.coach`
- **Subject**: `Stripe Invoice {{type}} - {{data__object__id}}`
- **Body**: Template (see below)

---

## 📧 Email Templates

### Payment Succeeded Template
```
Hi Daniel,

Great news! A payment has been received for one of your invoices.

Invoice Details:
• Invoice ID: {{data__object__id}}
• Customer: {{data__object__customer_email}}
• Amount: ${{data__object__amount_due / 100}} {{data__object__currency|upper}}
• Status: Paid ✅

The invoice has been automatically updated in your Airtable database.

Best regards,
Stripe Automation System
```

### Payment Failed Template
```
Hi Daniel,

A payment attempt has failed for one of your invoices.

Invoice Details:
• Invoice ID: {{data__object__id}}
• Customer: {{data__object__customer_email}}
• Amount: ${{data__object__amount_due / 100}} {{data__object__currency|upper}}
• Status: Payment Failed ❌

You may want to follow up with the customer or check the payment method.

Best regards,
Stripe Automation System
```

---

## 🧪 Testing the Zapier Setup

### Method 1: Using Zapier Test Feature
1. **In Zapier Editor** → Test Trigger
2. **Send test webhook** from Zapier interface
3. **Verify** data flows through all steps

### Method 2: Using Our Test Script
1. **Update the test script** webhook URL:
   ```javascript
   // In stripe-webhook-test.js, change:
   const WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/REDACTED/REDACTED_ZAPIER_HOOK_ID';
   ```

2. **Run single test**:
   ```bash
   node stripe-webhook-test.js --single invoice.created
   ```

3. **Check results**:
   - Zapier execution log
   - Airtable "Invoices" table
   - Email inbox (for payment events)

### Method 3: Stripe CLI (Most Realistic)
1. **Install Stripe CLI**: `brew install stripe/stripe-cli/stripe`
2. **Login**: `stripe login`
3. **Forward events**: `stripe listen --forward-to YOUR_ZAPIER_WEBHOOK_URL`
4. **Trigger test events**: `stripe trigger invoice.created`

---

## 🛠️ Advanced Configuration

### Multi-Step Workflow Example

```
1. Webhook Trigger (Stripe)
   ↓
2. Filter (Invoice events only)
   ↓
3. Lookup/Search in Airtable (Check if invoice exists)
   ↓
4. Paths:
   ├─ A: Create new record (if doesn't exist)
   └─ B: Update existing record (if exists)
   ↓
5. Filter (Payment events only)
   ↓
6. Send Email Notification
```

### Error Handling
- **Enable Zapier Auto-Replay** for failed steps
- **Set up Error Notifications** to your email
- **Configure Delays** between steps if needed
- **Add Filters** to handle malformed webhook data

### Data Validation
```javascript
// Custom Code by Zapier step for validation
const invoice = inputData.data.object;

if (!invoice.id || !invoice.amount_due) {
  throw new Error('Invalid invoice data received');
}

if (invoice.amount_due <= 0) {
  throw new Error('Invalid invoice amount');
}

return {
  validated: true,
  invoice_id: invoice.id,
  amount: invoice.amount_due / 100,
  currency: invoice.currency.toUpperCase()
};
```

---

## 💡 Pro Tips

### Performance Optimization
- **Use Paths** instead of multiple Zaps for complex logic
- **Batch operations** when possible (though not applicable here)
- **Cache frequently used data** in Storage by Zapier

### Security Best Practices
- **Verify webhook signatures** using Code by Zapier:
  ```javascript
  const crypto = require('crypto');
  
  const signature = inputData.headers['stripe-signature'];
  const payload = inputData.raw_body;
  const secret = 'whsec_your_webhook_secret';
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload, 'utf8')
    .digest('hex');
    
  // Verify signature matches
  ```

### Monitoring and Alerts
- **Set up Zapier notifications** for failed runs
- **Create dashboard** in Zapier for monitoring
- **Weekly digest** of automation performance

---

## 📊 Comparison: n8n vs Zapier

| Feature | n8n | Zapier |
|---------|-----|--------|
| **Cost** | Free (self-hosted) | $20+/month |
| **Complexity** | Higher learning curve | User-friendly |
| **Customization** | Full control | Limited but sufficient |
| **Reliability** | Depends on hosting | Very reliable |
| **Setup Time** | 2-3 hours | 30 minutes |
| **Webhook Issues** | Currently broken | Works immediately |

**Recommendation**: Use Zapier as primary solution until n8n webhook routing is fixed.

---

## 🎯 Implementation Checklist

### Immediate (15 minutes)
- [ ] Create new Zapier account/login
- [ ] Set up webhook trigger
- [ ] Configure Stripe webhook endpoint
- [ ] Test basic webhook reception

### Phase 1 (30 minutes)
- [ ] Add Airtable integration
- [ ] Configure field mapping
- [ ] Test invoice creation workflow
- [ ] Verify data in Airtable

### Phase 2 (45 minutes)
- [ ] Add email notifications for payments
- [ ] Set up filtering for payment events
- [ ] Test payment success/failure scenarios
- [ ] Configure error handling

### Phase 3 (60 minutes)
- [ ] Add webhook signature verification
- [ ] Set up monitoring and alerts
- [ ] Create comprehensive test suite
- [ ] Document the final setup

### Go Live
- [ ] Switch from Stripe test to live mode
- [ ] Update webhook endpoints
- [ ] Monitor first few real transactions
- [ ] Celebrate! 🎉

---

## 🔗 Quick Links

- **Zapier Dashboard**: https://zapier.com/app/dashboard
- **Stripe Webhooks**: https://dashboard.stripe.com/webhooks
- **Airtable Base**: https://airtable.com/appXk9QepZD7Riwyl
- **Test Script**: `/Users/colinaulds/Desktop/projects/dan-reece-actual-site/stripe-webhook-test.js`

**Need help?** This solution should be working within 30 minutes and provides the same functionality as the n8n approach with better reliability.