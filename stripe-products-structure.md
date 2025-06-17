# Stripe Products & Pricing Structure

## Individual Sessions
**Product Name**: Single Speech Coaching Session
- **Price**: $250
- **Payment**: Captured on day of session
- **Stripe Product ID**: `prod_single_session`
- **Stripe Price ID**: Set in STRIPE_PRICE_SESSION

## Package Deals

### Launch Package
**Product Name**: Launch Executive Package
- **Price**: $1,800
- **Sessions**: 8 sessions
- **Payment Options**:
  - Full payment: $1,800
  - 2-payment plan: $900 x 2 (monthly)
- **Stripe Product ID**: `prod_launch_package`
- **Stripe Price IDs**: 
  - Full: Set in STRIPE_PRICE_LAUNCH
  - Payment plan: `price_launch_payment_plan`

### Scale Package
**Product Name**: Scale Executive Package
- **Price**: $2,250
- **Sessions**: 10 sessions
- **Payment Options**:
  - Full payment: $2,250
  - 3-payment plan: $750 x 3 (monthly)
- **Stripe Product ID**: `prod_scale_package`
- **Stripe Price IDs**:
  - Full: Set in STRIPE_PRICE_SCALE
  - Payment plan: `price_scale_payment_plan`

## Team Packages

### Startup Team Package
**Product Name**: Startup Team Training
- **Price**: $3,000
- **Team Size**: Up to 5 people
- **Payment Options**:
  - Full payment: $3,000
  - 2-payment plan: $1,500 x 2
- **Stripe Product ID**: `prod_startup_team`
- **Stripe Price IDs**:
  - Full: Set in STRIPE_PRICE_STARTUP
  - Payment plan: `price_startup_payment_plan`

### Venture Team Package
**Product Name**: Venture Team Training
- **Price**: $3,750
- **Team Size**: Up to 10 people
- **Payment Options**:
  - Full payment: $3,750
  - 3-payment plan: $1,250 x 3
- **Stripe Product ID**: `prod_venture_team`
- **Stripe Price IDs**:
  - Full: Set in STRIPE_PRICE_VENTURE
  - Payment plan: `price_venture_payment_plan`

### Enterprise Team Package
**Product Name**: Enterprise Team Training
- **Price**: $4,375
- **Team Size**: Up to 15 people
- **Payment Options**:
  - Full payment: $4,375
  - 3-payment plan: $1,458.33 x 3
  - Corporate invoicing available
- **Stripe Product ID**: `prod_enterprise_team`
- **Stripe Price IDs**:
  - Full: Set in STRIPE_PRICE_ENTERPRISE
  - Payment plan: `price_enterprise_payment_plan`

## Payment Flow Architecture

1. **Checkout Session Creation**:
   - Use `payment_intent_data.capture_method: 'manual'`
   - Store session ID in Airtable
   - Set metadata with client info and session date

2. **Payment Capture**:
   - N8N workflow triggers on session day
   - Calls `capture-payment` function
   - Captures payment intent
   - Triggers invoice generation

3. **Invoice Flow**:
   - Auto-generate after successful capture
   - Include session details
   - Email to client
   - Store invoice URL in Airtable

## Metadata Structure

```json
{
  "client_id": "airtable_client_id",
  "session_date": "2025-01-15",
  "package_type": "launch|scale|team|single",
  "payment_plan": "full|2-pay|3-pay",
  "team_size": "5|10|15"
}
```