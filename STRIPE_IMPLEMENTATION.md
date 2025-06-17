# Stripe Billing Implementation Guide

## Overview

This implementation provides a complete Stripe payment processing system for Executive Speech Coaching NYC with the following key features:

- **Delayed Payment Capture**: Payments are authorized at booking but captured on the day of the session
- **Multiple Package Options**: Single sessions, packages with payment plans, and team packages
- **Automated Invoicing**: Invoices are automatically generated and sent after payment capture
- **N8N Integration**: Automated workflows for payment processing and notifications

## Setup Instructions

### 1. Environment Variables

Copy the updated `.env.example` file and fill in your Stripe credentials:

```bash
cp .env.example .env
```

Required Stripe variables:
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `STRIPE_WEBHOOK_SECRET`: Webhook endpoint secret from Stripe Dashboard
- All `STRIPE_PRICE_*` variables: Create products/prices in Stripe Dashboard

### 2. Create Stripe Products

In your Stripe Dashboard, create the following products and prices:

1. **Single Session** ($250)
2. **Launch Package** ($1,800 full / $900 x 2 monthly)
3. **Scale Package** ($2,250 full / $750 x 3 monthly)
4. **Startup Team** ($3,000 full / $1,500 x 2 monthly)
5. **Venture Team** ($3,750 full / $1,250 x 3 monthly)
6. **Enterprise Team** ($4,375 full / $1,458.33 x 3 monthly)

### 3. Configure Webhook Endpoint

In Stripe Dashboard > Webhooks:
1. Add endpoint: `https://your-site.netlify.app/.netlify/functions/stripe-webhook`
2. Select events:
   - `checkout.session.completed`
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `invoice.paid`
   - `invoice.payment_failed`
   - `customer.subscription.*`
3. Copy the webhook secret to your `.env` file

### 4. Deploy to Netlify

```bash
git add .
git commit -m "Add Stripe billing implementation"
git push origin feature/stripe-billing
```

### 5. Set Environment Variables in Netlify

In Netlify Dashboard > Site Settings > Environment Variables, add all the Stripe-related variables from your `.env` file.

## Usage

### Adding Payment to a Page

Include the Stripe payment partial in any page where you want to show package selection:

```html
{{ partial "stripe-payment.html" . }}
```

### Direct Checkout Links

You can create direct checkout links for specific packages:

```javascript
// Single session checkout
window.stripeCheckout.checkoutSingleSession('2025-02-15', {
  id: 'client-123',
  name: 'John Doe',
  email: 'john@example.com'
});

// Package checkout
window.stripeCheckout.checkoutPackage('launch', 'full', {
  id: 'client-123',
  name: 'Jane Doe',
  email: 'jane@example.com'
}, '2025-02-15');
```

## Payment Flow

1. **Client books session** → Stripe Checkout → Payment authorized (not captured)
2. **Checkout completed** → Webhook triggers → Session record created in Airtable
3. **Day of session** → N8N workflow triggers → Payment captured
4. **Payment captured** → Invoice generated → Email sent to client
5. **Invoice paid** → Airtable updated → Confirmation sent

## Testing

### Test Card Numbers

- Success: `4242 4242 4242 4242`
- Requires authentication: `4000 0025 0000 3155`
- Decline: `4000 0000 0000 9995`

### Test Workflow

1. Create a test booking with a session date of today
2. Verify payment intent is created but not captured
3. Manually trigger the capture-payment function
4. Verify invoice is generated and payment is captured

## Troubleshooting

### Payment Not Capturing

1. Check N8N workflow is running
2. Verify Payment Intent ID is stored in Airtable
3. Check Netlify Function logs for errors
4. Ensure webhook token matches between N8N and Netlify

### Invoice Not Generating

1. Verify Stripe customer exists
2. Check invoice settings in Stripe Dashboard
3. Review function logs for API errors
4. Ensure email settings are configured

### Webhook Failures

1. Verify webhook secret is correct
2. Check Netlify Function logs
3. Use Stripe CLI to test webhooks locally
4. Ensure all required events are selected

## Security Best Practices

1. **Never expose secret keys** in client-side code
2. **Validate webhook signatures** to ensure requests are from Stripe
3. **Use HTTPS** for all API calls
4. **Implement idempotency** for payment operations
5. **Log errors** without exposing sensitive data

## Support

For issues or questions:
- Check Stripe Dashboard logs
- Review Netlify Function logs
- Check N8N workflow execution history
- Contact support with error messages and timestamps