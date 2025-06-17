# n8n Integration Setup Guide

## Overview

This guide helps you set up n8n automation workflows for Executive Speech Coaching NYC, replacing expensive Zapier automations with a cost-effective self-hosted solution.

## Deployment Options

### Option 1: Railway (Recommended)
- **Cost**: ~$5/month
- **Pros**: Easy deployment, automatic SSL, good performance
- **Cons**: Requires payment method

### Option 2: Render
- **Cost**: Free tier available
- **Pros**: No payment required initially
- **Cons**: Free tier has limitations, cold starts

## Quick Start

### 1. Deploy to Railway

1. Click [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template)
2. Set environment variables from `.env.example`
3. Deploy and get your n8n URL

### 2. Deploy to Render

1. Fork this repository
2. Connect to Render
3. Use `render.yaml` configuration
4. Set environment variables

## Environment Variables

### Required Variables

```bash
# N8N Core Settings
N8N_BASIC_AUTH_USER=your_username
N8N_BASIC_AUTH_PASSWORD=your_secure_password
N8N_ENCRYPTION_KEY=your_32_character_key_here

# Database (SQLite for free tier)
DB_TYPE=sqlite
DB_SQLITE_DATABASE=database.sqlite

# Timezone
GENERIC_TIMEZONE=America/New_York

# Webhook Security
N8N_WEBHOOK_TOKEN=your_webhook_security_token
```

### Integration Variables

```bash
# Airtable
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_CLIENTS_TABLE=Clients
AIRTABLE_SESSIONS_TABLE=Sessions
AIRTABLE_LEADS_TABLE=Leads

# Email (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_specific_password
EMAIL_FROM="Daniel Reece <daniel@executivespeechcoachingnyc.com>"
ADMIN_EMAIL=daniel@executivespeechcoachingnyc.com

# Stripe
STRIPE_SECRET_KEY=sk_test_your_key
STRIPE_PAYMENT_CAPTURE_DELAY_DAYS=0

# Calendar (optional)
CAL_COM_API_KEY=your_cal_com_key_if_using
GOOGLE_CALENDAR_ID=primary
```

## Webhook Endpoints

After deployment, your webhook endpoints will be:

### Contact Form
```
POST https://your-n8n-instance.railway.app/webhook/contact-form
Headers: 
  X-Webhook-Token: your_webhook_security_token
Body: {
  "name": "Client Name",
  "email": "client@email.com",
  "phone": "+1234567890",
  "company": "Company Name",
  "service": "Service Interest",
  "message": "Message content"
}
```

### Booking Created
```
POST https://your-n8n-instance.railway.app/webhook/booking-created
Headers:
  X-Webhook-Token: your_webhook_security_token
Body: {
  "clientEmail": "client@email.com",
  "clientName": "Client Name",
  "sessionDate": "2025-01-20T10:00:00Z",
  "sessionType": "Initial Consultation"
}
```

### Payment Received
```
POST https://your-n8n-instance.railway.app/webhook/payment-received
Headers:
  X-Webhook-Token: your_webhook_security_token
Body: {
  "stripePaymentIntentId": "pi_xxx",
  "amount": 1500,
  "clientEmail": "client@email.com"
}
```

### Calendar Sync (Manual Trigger)
```
POST https://your-n8n-instance.railway.app/webhook/calendar-sync
Headers:
  X-Webhook-Token: your_webhook_security_token
```

### Trigger Email Sequence
```
POST https://your-n8n-instance.railway.app/webhook/trigger-sequence
Headers:
  X-Webhook-Token: your_webhook_security_token
Body: {
  "contactId": "airtable_record_id",
  "sequence": "Welcome" // or "Post-Session", "Upsell"
}
```

## Workflow Configuration

### 1. Import Workflows

1. Access n8n at `https://your-instance.railway.app`
2. Login with your basic auth credentials
3. Go to Workflows > Import
4. Import each JSON file from `n8n/workflows/`

### 2. Configure Credentials

#### Airtable API
1. Go to Credentials > New
2. Select "Airtable API"
3. Enter your API key

#### Gmail SMTP
1. Go to Credentials > New
2. Select "SMTP"
3. Configure:
   - Host: smtp.gmail.com
   - Port: 587
   - User: your email
   - Password: app-specific password
   - SSL/TLS: ON

#### Stripe API
1. Go to Credentials > New
2. Select "Stripe API"
3. Enter your secret key

#### Webhook Token Auth
1. Go to Credentials > New
2. Select "Header Auth"
3. Configure:
   - Name: X-Webhook-Token
   - Value: your_webhook_security_token

### 3. Activate Workflows

1. Open each workflow
2. Click the toggle to activate
3. Test webhook endpoints

## Airtable Setup

### Required Tables

#### Clients Table
- Name (Single line text)
- Email (Email)
- Phone (Phone)
- Company (Single line text)
- Total Sessions (Count)
- Lifetime Value (Currency)
- Status (Single select: Active, Inactive, Prospect)

#### Sessions Table
- Client (Link to Clients)
- Client Email (Email)
- Client Name (Single line text)
- Session Date (Date/time)
- End Time (Date/time)
- Duration (minutes) (Number)
- Session Type (Single line text)
- Status (Single select: Scheduled, Completed, Cancelled)
- Payment Status (Single select: Pending, Scheduled, Captured, Failed)
- Calendar Event ID (Single line text)
- Stripe Payment Intent ID (Single line text)

#### Leads Table
- Name (Single line text)
- Email (Email)
- Phone (Phone)
- Company (Single line text)
- Service Interest (Single line text)
- Message (Long text)
- Source (Single line text)
- Status (Single select: New, Contacted, Qualified, Converted)
- Email Sequence (Single select: None, Welcome, Post-Session, Upsell, Completed)
- Sequence Step (Number)
- Last Email Sent (Date/time)
- Created Date (Created time)

## Testing

### Test Contact Form
```bash
curl -X POST https://your-n8n-instance.railway.app/webhook/contact-form \
  -H "X-Webhook-Token: your_webhook_security_token" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+1234567890",
    "company": "Test Company",
    "service": "1-1 Coaching",
    "message": "Test message"
  }'
```

### Test Calendar Sync
```bash
curl -X POST https://your-n8n-instance.railway.app/webhook/calendar-sync \
  -H "X-Webhook-Token: your_webhook_security_token"
```

## Monitoring

### Check Workflow Executions
1. Go to Executions in n8n
2. Filter by workflow
3. Check for errors

### Email Notifications
Error notifications will be sent to ADMIN_EMAIL when:
- Webhook authentication fails
- Airtable operations fail
- Email sending fails
- Payment capture fails

## Cost Optimization

### Minimize API Calls
- Batch Airtable operations
- Use webhook triggers instead of polling where possible
- Set appropriate cron intervals

### Storage Management
- Enable execution pruning (7 days)
- Use SQLite for free tier
- Limit binary data storage

## Troubleshooting

### Common Issues

1. **Webhook returns 401**
   - Check X-Webhook-Token header
   - Verify token in credentials

2. **Airtable errors**
   - Verify API key and base ID
   - Check table and field names match exactly

3. **Email not sending**
   - Enable 2FA on Gmail
   - Generate app-specific password
   - Check SMTP credentials

4. **Calendar sync issues**
   - Verify Cal.com API key or Google credentials
   - Check calendar permissions

### Debug Mode
1. Set workflow to "Save all executions"
2. Check execution data
3. Use webhook.site for testing

## Security Best Practices

1. Use strong passwords for n8n access
2. Rotate webhook tokens regularly
3. Limit n8n access by IP if possible
4. Use environment variables for all secrets
5. Enable 2FA on all integrated services

## Support

For issues specific to:
- n8n: Check [n8n community](https://community.n8n.io)
- Airtable: Review [API documentation](https://airtable.com/api)
- Railway/Render: Check deployment logs

## Next Steps

1. Complete environment variable setup
2. Deploy to Railway or Render
3. Import and configure workflows
4. Test all webhook endpoints
5. Connect to Netlify Functions
6. Monitor executions for 24 hours