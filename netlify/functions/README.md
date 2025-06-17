# Netlify Functions API Documentation

## Overview

This directory contains the serverless functions that power the backend of Executive Speech Coaching NYC website. All functions are deployed automatically via Netlify Functions.

## Base URL

- Development: `http://localhost:8888/.netlify/functions/`
- Production: `https://executivespeechcoachingnyc.com/.netlify/functions/`

## Available Endpoints

### 1. Contact Form Submission

**Endpoint:** `POST /.netlify/functions/contact-form`

Handles contact form submissions, creates records in Airtable, and sends notification emails.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1-555-0123",
  "company": "Acme Corp",
  "message": "I'm interested in executive coaching...",
  "serviceInterest": "1-1 Speech Coaching",
  "referralSource": "Google Search"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you for your message. We will get back to you soon!",
  "recordId": "recXXXXXXXXXXXXXX"
}
```

### 2. Newsletter Signup

**Endpoint:** `POST /.netlify/functions/newsletter-signup`

Manages newsletter subscriptions with duplicate checking.

**Request Body:**
```json
{
  "email": "subscriber@example.com",
  "firstName": "Jane",
  "lastName": "Smith",
  "interests": ["Public Speaking", "Executive Presence"],
  "referralSource": "Blog Post"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thank you for subscribing! Check your email for a welcome message.",
  "recordId": "recXXXXXXXXXXXXXX"
}
```

### 3. Generic Webhook Receiver

**Endpoint:** `POST /.netlify/functions/webhook-receiver`

Receives and processes webhooks from various services (Stripe, n8n, etc.).

**Headers (if token configured):**
```
Authorization: Bearer YOUR_WEBHOOK_TOKEN
```
or
```
X-Webhook-Token: YOUR_WEBHOOK_TOKEN
```

**Request Body:**
```json
{
  "type": "stripe.payment_intent.succeeded",
  "payload": {
    // Service-specific payload
  }
}
```

**Supported Webhook Types:**
- `stripe.payment_intent.succeeded`
- `calendar.event.created`
- `form.submission`
- `n8n.workflow.complete`

## Error Responses

All endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "details": ["Additional error details"] // Optional
}
```

**Status Codes:**
- `200` - Success
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (webhook token mismatch)
- `405` - Method Not Allowed
- `500` - Internal Server Error

## Environment Variables Required

Copy `.env.example` to `.env` and fill in these required values:

### Airtable
- `AIRTABLE_API_KEY`
- `AIRTABLE_BASE_ID`
- `AIRTABLE_CLIENTS_TABLE`
- `AIRTABLE_SESSIONS_TABLE`
- `AIRTABLE_LEADS_TABLE`

### Email
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `EMAIL_FROM`
- `ADMIN_EMAIL`

### n8n (Optional)
- `N8N_CONTACT_WEBHOOK`
- `N8N_NEWSLETTER_WEBHOOK`
- `N8N_WEBHOOK_TOKEN`

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create `.env` file with your credentials

3. Start Netlify Dev:
   ```bash
   npx netlify dev
   ```

4. Functions will be available at `http://localhost:8888/.netlify/functions/`

## Testing

Use curl or Postman to test the endpoints:

```bash
# Test contact form
curl -X POST http://localhost:8888/.netlify/functions/contact-form \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message"
  }'
```

## Security Considerations

1. All inputs are sanitized to prevent XSS attacks
2. Email and phone validation is enforced
3. Rate limiting is implemented to prevent abuse
4. Webhook endpoints can be secured with tokens
5. Internal errors are not exposed to clients
6. CORS is configured for production use

## Deployment

Functions are automatically deployed when pushing to the main branch. Ensure all environment variables are configured in Netlify's dashboard before deployment.