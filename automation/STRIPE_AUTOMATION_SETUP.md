# Stripe Invoice Automation System

## Overview

Complete automation system for handling Stripe invoice events using n8n workflows and Airtable data storage. This system processes invoice creation, payments, failures, and other events automatically.

## 🏗️ Configuration Summary

### Service/Platform configured
- **n8n Workflow Engine**: https://n8n-rrrs.sliplane.app
- **Airtable Database**: Base ID `appXk9QepZD7Riwyl`
- **Zapier Integration**: Available as backup solution
- **Gmail Notifications**: Configured for important events

### Authentication method used
- **n8n API**: JWT Token authentication
- **Airtable**: Personal Access Token (PAT)
- **Stripe**: Test API keys (webhook signature validation)

### Endpoints/Servers set up
- **Primary Workflow**: `vsJ1Z0eWhcTXc23L` - "Stripe Invoice Automation"
- **Webhook URL**: `https://n8n-rrrs.sliplane.app/webhook/stripe`
- **Airtable Integration**: "Invoices" table with proper field mapping

---

## 📋 Implementation Details

### Workflow Architecture

The n8n workflow (`vsJ1Z0eWhcTXc23L`) consists of these nodes:

1. **Stripe Webhook** (`webhook-stripe`)
   - Path: `/stripe`
   - Method: POST
   - Raw body enabled for Stripe signature verification
   
2. **Filter Invoice Events** (`if-invoice-event`)
   - Processes: `invoice.created`, `invoice.payment_succeeded`, `invoice.payment_failed`, `invoice.sent`, `invoice.finalized`
   - Uses conditional logic to handle only relevant events
   
3. **Extract Invoice Data** (`extract-invoice-data`)
   - Maps Stripe webhook payload to structured data
   - Converts timestamps and currency amounts
   - Maps Stripe status to Airtable-comREDACTED_AIRTABLE_PAT values
   
4. **Save to Airtable** (`save-to-airtable`)
   - Appends records to "Invoices" table
   - Maps fields: Invoice Number, Amount Due, Status, etc.
   - Includes metadata like webhook received timestamp

5. **Check Notification Events** (`check-notification-events`)
   - Filters for payment success/failure events
   - Triggers email notifications for critical events

### Airtable Field Mapping

| Stripe Field | Airtable Field | Transform |
|--------------|---------------|-----------|
| `data.object.id` | Invoice Number | Direct mapping |
| `data.object.created` | Invoice Date | Unix timestamp to ISO |
| `data.object.amount_due` | Amount Due | Divide by 100 (cents to dollars) |
| `data.object.status` | Status | Map to: Paid/Pending/Overdue |
| `data.object.description` | Services Provided | Direct or fallback to ID |
| `data.object.customer_email` | Notes (part of) | Combined with event metadata |

### Environment Variables Configured

```bash
# n8n Configuration (in MCP config)
N8N_API_URL=https://n8n-rrrs.sliplane.app/api/v1
N8N_API_KEY=REDACTED_JWT

# Airtable Configuration
AIRTABLE_API_KEY=REDACTED_AIRTABLE_PAT

# Future Stripe Configuration (when going live)
STRIPE_WEBHOOK_SECRET=whsec_... (to be configured)
```

---

## 🧪 Testing Results

### Created Testing Script: `stripe-webhook-test.js`

**Location**: `/Users/colinaulds/Desktop/projects/dan-reece-actual-site/stripe-webhook-test.js`

**Features**:
- Simulates all 5 Stripe invoice event types
- Realistic test data with proper structure
- Sequential sending with delays to prevent overload
- Single event testing capability
- Response validation and logging

**Usage Examples**:
```bash
# Run full test suite
node stripe-webhook-test.js

# Test single event type
node stripe-webhook-test.js --single invoice.created
node stripe-webhook-test.js --single invoice.payment_succeeded

# Show help
node stripe-webhook-test.js --help
```

### Current Status - WEBHOOK ISSUE IDENTIFIED

⚠️ **CRITICAL**: The n8n webhook system is not responding properly to production URLs.
- Both the new Stripe webhook and existing contact-form webhook return 404
- This appears to be a deployment configuration issue with the n8n instance
- The workflow is active but webhooks are not registering properly

---

## 🔧 Next Steps

### Immediate Actions Needed

1. **Resolve n8n Webhook Issue**:
   - Check n8n deployment configuration for webhook routing
   - Verify domain/proxy settings at https://n8n-rrrs.sliplane.app
   - Consider redeploying or checking n8n server logs

2. **Alternative Implementation (Zapier)**:
   - Set up Zapier webhook as backup
   - Configure same logic in Zapier flows
   - Use existing Zapier-Airtable integration

3. **Stripe Configuration**:
   - Configure webhook endpoints in Stripe Dashboard
   - Set up webhook signature verification
   - Test with Stripe CLI for local development

### Recommended Setup Order

1. **Fix n8n Webhook Routing**:
   ```bash
   # Test webhook accessibility
   curl -X POST https://n8n-rrrs.sliplane.app/webhook/stripe
   
   # Should not return 404 if properly configured
   ```

2. **Configure Stripe Webhooks**:
   - Go to Stripe Dashboard → Webhooks
   - Add endpoint: `https://n8n-rrrs.sliplane.app/webhook/stripe`
   - Select events: `invoice.created`, `invoice.payment_succeeded`, `invoice.payment_failed`, `invoice.sent`, `invoice.finalized`
   - Copy webhook signing secret for verification

3. **Test End-to-End**:
   ```bash
   # Use test script
   node stripe-webhook-test.js --single invoice.created
   
   # Verify in Airtable
   # Check n8n execution logs
   ```

---

## 📖 Troubleshooting Guide

### Common Issues and Solutions

#### Webhook 404 Errors
- **Symptom**: `{"code":404,"message":"The requested webhook \"POST stripe\" is not registered."}`
- **Cause**: n8n webhook routing issue or deployment configuration
- **Solution**: Check n8n deployment, verify webhook URL format, restart n8n service

#### Airtable Field Mapping Errors
- **Symptom**: Records not created or fields missing
- **Cause**: Field name mismatch or data type incomREDACTED_AIRTABLE_PAT
- **Solution**: Verify field names in Airtable match workflow configuration

#### Stripe Webhook Signature Failures
- **Symptom**: Webhook receives data but signature validation fails
- **Cause**: Missing or incorrect webhook signing secret
- **Solution**: Configure `STRIPE_WEBHOOK_SECRET` environment variable

### Debugging Commands

```bash
# Check n8n workflow status
curl -H "X-N8N-API-KEY: ..." https://n8n-rrrs.sliplane.app/api/v1/workflows/vsJ1Z0eWhcTXc23L

# Check workflow executions
curl -H "X-N8N-API-KEY: ..." "https://n8n-rrrs.sliplane.app/api/v1/executions?workflowId=vsJ1Z0eWhcTXc23L"

# Test webhook manually
curl -X POST -H "Content-Type: application/json" \
  -d '{"type":"invoice.created","data":{"object":{"id":"test"}}}' \
  https://n8n-rrrs.sliplane.app/webhook/stripe

# Verify Airtable integration
# Check https://airtable.com/appXk9QepZD7Riwyl/tblU6RuKQISUcX6vx
```

---

## 📞 Support Resources

### Documentation Links
- [n8n Webhook Documentation](https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/)
- [Stripe Webhook Guide](https://stripe.com/docs/webhooks)
- [Airtable API Reference](https://airtable.com/developers/web/api/introduction)

### Configuration Files
- **n8n MCP Config**: `/Users/colinaulds/Library/Application Support/Claude/config.json`
- **Test Script**: `/Users/colinaulds/Desktop/projects/dan-reece-actual-site/stripe-webhook-test.js`
- **This Documentation**: `/Users/colinaulds/Desktop/projects/dan-reece-actual-site/STRIPE_AUTOMATION_SETUP.md`

### Key URLs
- **n8n Instance**: https://n8n-rrrs.sliplane.app
- **Workflow Editor**: https://n8n-rrrs.sliplane.app/workflow/vsJ1Z0eWhcTXc23L
- **Airtable Base**: https://airtable.com/appXk9QepZD7Riwyl
- **Webhook Endpoint**: https://n8n-rrrs.sliplane.app/webhook/stripe ⚠️ (currently not working)

---

## 🎯 Production Checklist

Before going live with real Stripe data:

- [ ] ✅ n8n workflow created and configured
- [ ] ✅ Airtable "Invoices" table verified and accessible  
- [ ] ✅ Test script created with comprehensive event coverage
- [ ] ❌ Webhook endpoint responding properly (CRITICAL ISSUE)
- [ ] ❌ Stripe webhook configured in dashboard
- [ ] ❌ Webhook signature verification implemented
- [ ] ❌ Email notifications tested and working
- [ ] ❌ Error handling and retry logic tested
- [ ] ❌ Production credentials configured (replace test keys)
- [ ] ❌ Monitoring and alerting set up

**Status**: 🟡 **PARTIAL IMPLEMENTATION** - Core logic completed, webhook routing issue blocking testing