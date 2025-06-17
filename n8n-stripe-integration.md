# N8N Stripe Integration Documentation

## Overview

This document outlines the N8N workflows needed to automate the Stripe payment capture and invoicing process for Executive Speech Coaching NYC.

## Required N8N Workflows

### 1. Daily Payment Capture Workflow

**Trigger**: Schedule (Daily at 9:00 AM EST)

**Steps**:
1. **Airtable - Get Today's Sessions**
   - Filter: `{Session Date} = TODAY()`
   - Fields: Session ID, Client ID, Payment Intent ID, Session Date

2. **Filter - Check Payment Intent Exists**
   - Continue only if Payment Intent ID is not empty

3. **HTTP Request - Capture Payment**
   - URL: `https://executivespeechcoachingnyc.com/.netlify/functions/capture-payment`
   - Method: POST
   - Headers: 
     - `X-Webhook-Token`: `{{$env.N8N_WEBHOOK_TOKEN}}`
   - Body:
     ```json
     {
       "paymentIntentId": "{{$node["Airtable"].json["Payment Intent ID"]}}",
       "clientId": "{{$node["Airtable"].json["Client ID"]}}",
       "sessionDate": "{{$node["Airtable"].json["Session Date"]}}"
     }
     ```

4. **Airtable - Update Session Record**
   - Update fields:
     - Payment Status: "Captured"
     - Payment Captured At: `{{$now}}`
     - Invoice URL: `{{$node["HTTP Request"].json["invoice"]["url"]}}`

5. **Gmail - Send Invoice Email**
   - To: Client Email
   - Subject: "Your Executive Speech Coaching Invoice"
   - Body: Include invoice URL and session details

### 2. Payment Webhook Handler

**Trigger**: Webhook
**URL**: `/webhook/payment-received`

**Steps**:
1. **Webhook - Receive Payment Event**
   - Authentication: Check X-Webhook-Token header

2. **Switch - Route by Event Type**
   - Case: `payment.captured` → Update Airtable, Send confirmation
   - Case: `payment.failed` → Send alert to admin, update status
   - Case: `invoice.created` → Store invoice details
   - Case: `subscription.updated` → Update client subscription status

3. **Airtable - Update Records**
   - Update relevant tables based on event type

4. **Email/SMS - Send Notifications**
   - Client notifications for successful payments
   - Admin alerts for failures

### 3. Booking Created Webhook

**Trigger**: Webhook
**URL**: `/webhook/booking-created`

**Steps**:
1. **Webhook - Receive Booking Data**
   - From Stripe checkout completion

2. **Airtable - Create/Update Client Record**
   - Check if client exists by email
   - Create new or update existing

3. **Airtable - Create Session Record**
   - Link to Client
   - Store Payment Intent ID
   - Set Session Date
   - Set Payment Status: "Authorized"

4. **Google Calendar - Create Event**
   - Create calendar event for session
   - Invite client

5. **Email - Send Confirmation**
   - Session details
   - Payment will be captured on session day
   - Preparation materials

### 4. Error Notification Workflow

**Trigger**: Webhook
**URL**: `/webhook/error-notification`

**Steps**:
1. **Webhook - Receive Error Event**

2. **Slack/Email - Alert Admin**
   - Send to: `{{$env.ADMIN_EMAIL}}`
   - Include error details and context

3. **Airtable - Log Error**
   - Create error log entry for tracking

## Environment Variables for N8N

Add these to your N8N instance:

```env
# Webhook Security
N8N_WEBHOOK_TOKEN=your_secure_webhook_token

# Airtable
AIRTABLE_API_KEY=your_airtable_api_key
AIRTABLE_BASE_ID=your_base_id
AIRTABLE_CLIENTS_TABLE=Clients
AIRTABLE_SESSIONS_TABLE=Sessions

# Email Settings
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Admin Notifications
ADMIN_EMAIL=daniel@executivespeechcoachingnyc.com
ADMIN_SMS=+19173009337

# Site URLs
SITE_URL=https://executivespeechcoachingnyc.com
```

## Airtable Schema Requirements

### Clients Table
- Client ID (Autonumber)
- Name (Text)
- Email (Email)
- Phone (Phone)
- Stripe Customer ID (Text)
- Total Sessions (Rollup)
- Package Type (Single Select)
- Created At (Created time)

### Sessions Table
- Session ID (Autonumber)
- Client (Link to Clients)
- Session Date (Date)
- Session Time (Time)
- Payment Intent ID (Text)
- Payment Status (Single Select: Pending, Authorized, Captured, Failed, Refunded)
- Payment Amount (Currency)
- Invoice URL (URL)
- Payment Captured At (Date/Time)
- Notes (Long text)

## Security Considerations

1. **Webhook Authentication**: Always verify the `X-Webhook-Token` header
2. **HTTPS Only**: Ensure all webhooks use HTTPS
3. **Error Handling**: Log all errors but don't expose sensitive data
4. **Rate Limiting**: Implement rate limiting on webhook endpoints
5. **Idempotency**: Handle duplicate webhook calls gracefully

## Testing Checklist

- [ ] Test single session payment capture
- [ ] Test package payment with payment plans
- [ ] Test failed payment handling
- [ ] Test subscription creation and updates
- [ ] Test invoice generation and delivery
- [ ] Test error notifications
- [ ] Test webhook authentication
- [ ] Test Airtable record creation/updates
- [ ] Test email notifications
- [ ] Test calendar event creation