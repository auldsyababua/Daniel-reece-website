# User Story 002-4: Financial and Sales Tables Schema

## User Story
**As a** business operations manager  
**I want** to implement comprehensive financial tracking and sales management tables in D1 database  
**So that** revenue streams, pricing models, and financial performance are accurately tracked and reportable

## Acceptance Criteria
1. Design pricing packages table supporting multiple service tiers and custom packages
2. Create invoice and payment tracking tables with full audit trails
3. Implement discount codes and promotional pricing management
4. Support multiple payment methods and gateway integrations (Stripe, PayPal)
5. Enable subscription billing with recurring payment tracking
6. Create revenue reporting views with period-over-period comparisons
7. Implement refund and credit note management
8. Support multi-currency transactions with exchange rate tracking
9. Enable automated payment reconciliation and status updates
10. Ensure PCI compliance considerations and secure payment data handling

## Implementation Guide

### 🔧 Required Tools & MCPs
- **Wrangler CLI**: Database schema deployment and migrations
- **mcp__github__**: Version control for financial schema
- **mcp__n8n-cloud__**: Payment automation workflows
- **mcp__airtable__**: Migrate existing financial records
- **Stripe CLI**: Webhook testing and payment integration
- **mcp__ref__**: Stripe and payment documentation
- **mcp__exasearch__**: Financial database best practices

### 📋 Step-by-Step Implementation

#### 1. Create Pricing and Package Tables

```sql
-- service_packages table: Define coaching packages and pricing tiers
CREATE TABLE service_packages (
    package_id INTEGER PRIMARY KEY AUTOINCREMENT,
    package_name TEXT NOT NULL,
    package_type TEXT CHECK(package_type IN ('standard', 'custom', 'bundle', 'add_on')),
    description TEXT,
    duration_months INTEGER,
    session_count INTEGER,
    session_duration_minutes INTEGER DEFAULT 60,
    price_usd DECIMAL(10,2) NOT NULL,
    currency_code TEXT DEFAULT 'USD',
    features TEXT, -- JSON array of included features
    max_participants INTEGER DEFAULT 1,
    is_active BOOLEAN DEFAULT 1,
    display_order INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- pricing_tiers table: Volume-based or tier-based pricing
CREATE TABLE pricing_tiers (
    tier_id INTEGER PRIMARY KEY AUTOINCREMENT,
    package_id INTEGER NOT NULL,
    tier_name TEXT NOT NULL,
    min_quantity INTEGER NOT NULL,
    max_quantity INTEGER,
    unit_price DECIMAL(10,2) NOT NULL,
    discount_percentage DECIMAL(5,2),
    FOREIGN KEY (package_id) REFERENCES service_packages(package_id) ON DELETE CASCADE
);

-- discount_codes table: Promotional codes and coupons
CREATE TABLE discount_codes (
    discount_id INTEGER PRIMARY KEY AUTOINCREMENT,
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    discount_type TEXT CHECK(discount_type IN ('percentage', 'fixed_amount', 'free_trial')),
    discount_value DECIMAL(10,2) NOT NULL,
    min_purchase_amount DECIMAL(10,2),
    max_uses INTEGER,
    current_uses INTEGER DEFAULT 0,
    valid_from DATE NOT NULL,
    valid_until DATE NOT NULL,
    applicable_packages TEXT, -- JSON array of package_ids
    is_active BOOLEAN DEFAULT 1,
    created_by TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX idx_discount_codes_active ON discount_codes(is_active, valid_from, valid_until);
CREATE INDEX idx_packages_active ON service_packages(is_active, package_type);
```

#### 2. Create Invoice and Payment Tables

```sql
-- invoices table: Track all invoices
CREATE TABLE invoices (
    invoice_id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_number TEXT NOT NULL UNIQUE,
    client_id INTEGER NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) DEFAULT 0,
    discount_amount DECIMAL(10,2) DEFAULT 0,
    total_amount DECIMAL(10,2) NOT NULL,
    currency_code TEXT DEFAULT 'USD',
    status TEXT CHECK(status IN ('draft', 'sent', 'viewed', 'paid', 'partial', 'overdue', 'cancelled', 'refunded')),
    payment_terms TEXT,
    notes TEXT,
    stripe_invoice_id TEXT,
    sent_date DATETIME,
    paid_date DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE RESTRICT
);

-- invoice_items table: Line items for invoices
CREATE TABLE invoice_items (
    item_id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER NOT NULL,
    package_id INTEGER,
    description TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2) NOT NULL,
    discount_percentage DECIMAL(5,2) DEFAULT 0,
    tax_rate DECIMAL(5,2) DEFAULT 0,
    line_total DECIMAL(10,2) NOT NULL,
    service_period_start DATE,
    service_period_end DATE,
    FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id) ON DELETE CASCADE,
    FOREIGN KEY (package_id) REFERENCES service_packages(package_id)
);

-- payments table: Track all payments received
CREATE TABLE payments (
    payment_id INTEGER PRIMARY KEY AUTOINCREMENT,
    invoice_id INTEGER,
    client_id INTEGER NOT NULL,
    payment_date DATETIME NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency_code TEXT DEFAULT 'USD',
    payment_method TEXT CHECK(payment_method IN ('stripe', 'paypal', 'bank_transfer', 'check', 'cash', 'other')),
    transaction_id TEXT,
    stripe_payment_intent_id TEXT,
    status TEXT CHECK(status IN ('pending', 'processing', 'completed', 'failed', 'refunded', 'partial_refund')),
    processing_fee DECIMAL(10,2),
    net_amount DECIMAL(10,2),
    reference_number TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (invoice_id) REFERENCES invoices(invoice_id),
    FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE RESTRICT
);

-- payment_methods table: Store client payment methods (tokenized)
CREATE TABLE payment_methods (
    method_id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    method_type TEXT CHECK(method_type IN ('card', 'bank_account', 'paypal')),
    stripe_payment_method_id TEXT,
    last_four TEXT, -- Last 4 digits only
    brand TEXT, -- Visa, Mastercard, etc.
    exp_month INTEGER,
    exp_year INTEGER,
    is_default BOOLEAN DEFAULT 0,
    is_active BOOLEAN DEFAULT 1,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_invoices_client ON invoices(client_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_payments_client ON payments(client_id);
CREATE INDEX idx_payments_date ON payments(payment_date);
```

#### 3. Create Subscription and Recurring Billing Tables

```sql
-- subscriptions table: Manage recurring services
CREATE TABLE subscriptions (
    subscription_id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER NOT NULL,
    package_id INTEGER NOT NULL,
    stripe_subscription_id TEXT,
    status TEXT CHECK(status IN ('trialing', 'active', 'past_due', 'cancelled', 'paused')),
    start_date DATE NOT NULL,
    current_period_start DATE NOT NULL,
    current_period_end DATE NOT NULL,
    trial_end_date DATE,
    cancel_at_period_end BOOLEAN DEFAULT 0,
    cancelled_at DATETIME,
    cancellation_reason TEXT,
    billing_cycle TEXT CHECK(billing_cycle IN ('monthly', 'quarterly', 'semi_annual', 'annual')),
    next_billing_date DATE,
    price_per_period DECIMAL(10,2) NOT NULL,
    discount_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES clients(client_id) ON DELETE RESTRICT,
    FOREIGN KEY (package_id) REFERENCES service_packages(package_id),
    FOREIGN KEY (discount_id) REFERENCES discount_codes(discount_id)
);

-- subscription_events table: Track subscription lifecycle events
CREATE TABLE subscription_events (
    event_id INTEGER PRIMARY KEY AUTOINCREMENT,
    subscription_id INTEGER NOT NULL,
    event_type TEXT CHECK(event_type IN (
        'created', 'activated', 'renewed', 'upgraded', 'downgraded', 
        'paused', 'resumed', 'cancelled', 'expired', 'payment_failed'
    )),
    event_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    previous_value TEXT,
    new_value TEXT,
    metadata TEXT, -- JSON for additional event data
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(subscription_id) ON DELETE CASCADE
);

-- recurring_charges table: Schedule of recurring charges
CREATE TABLE recurring_charges (
    charge_id INTEGER PRIMARY KEY AUTOINCREMENT,
    subscription_id INTEGER NOT NULL,
    scheduled_date DATE NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status TEXT CHECK(status IN ('scheduled', 'processing', 'completed', 'failed', 'cancelled')),
    attempts INTEGER DEFAULT 0,
    last_attempt_date DATETIME,
    payment_id INTEGER,
    failure_reason TEXT,
    FOREIGN KEY (subscription_id) REFERENCES subscriptions(subscription_id) ON DELETE CASCADE,
    FOREIGN KEY (payment_id) REFERENCES payments(payment_id)
);

CREATE INDEX idx_subscriptions_client ON subscriptions(client_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_recurring_charges_date ON recurring_charges(scheduled_date, status);
```

#### 4. Create Financial Reporting Views

```sql
-- revenue_summary view: Monthly revenue tracking
CREATE VIEW revenue_summary AS
SELECT 
    strftime('%Y-%m', payment_date) as month,
    COUNT(DISTINCT client_id) as unique_clients,
    COUNT(*) as total_transactions,
    SUM(amount) as gross_revenue,
    SUM(processing_fee) as total_fees,
    SUM(net_amount) as net_revenue,
    AVG(amount) as avg_transaction_value
FROM payments
WHERE status = 'completed'
GROUP BY strftime('%Y-%m', payment_date)
ORDER BY month DESC;

-- client_lifetime_value view: CLV calculation
CREATE VIEW client_lifetime_value AS
SELECT 
    c.client_id,
    c.first_name || ' ' || c.last_name as client_name,
    MIN(p.payment_date) as first_payment_date,
    MAX(p.payment_date) as last_payment_date,
    COUNT(DISTINCT p.payment_id) as total_payments,
    SUM(p.amount) as lifetime_revenue,
    AVG(p.amount) as avg_payment_amount,
    ROUND(julianday(MAX(p.payment_date)) - julianday(MIN(p.payment_date))) as customer_days,
    CASE 
        WHEN s.status = 'active' THEN 'Active'
        WHEN s.status = 'cancelled' THEN 'Churned'
        ELSE 'One-time'
    END as customer_status
FROM clients c
LEFT JOIN payments p ON c.client_id = p.client_id AND p.status = 'completed'
LEFT JOIN subscriptions s ON c.client_id = s.client_id
GROUP BY c.client_id;

-- outstanding_invoices view: Accounts receivable
CREATE VIEW outstanding_invoices AS
SELECT 
    i.invoice_id,
    i.invoice_number,
    c.first_name || ' ' || c.last_name as client_name,
    i.invoice_date,
    i.due_date,
    i.total_amount,
    COALESCE(SUM(p.amount), 0) as amount_paid,
    i.total_amount - COALESCE(SUM(p.amount), 0) as balance_due,
    CASE 
        WHEN i.due_date < date('now') THEN 'Overdue'
        WHEN i.due_date <= date('now', '+7 days') THEN 'Due Soon'
        ELSE 'Current'
    END as aging_status,
    julianday('now') - julianday(i.due_date) as days_overdue
FROM invoices i
LEFT JOIN clients c ON i.client_id = c.client_id
LEFT JOIN payments p ON i.invoice_id = p.invoice_id AND p.status = 'completed'
WHERE i.status NOT IN ('paid', 'cancelled')
GROUP BY i.invoice_id
HAVING balance_due > 0;

-- mrr_calculation view: Monthly Recurring Revenue
CREATE VIEW mrr_calculation AS
SELECT 
    strftime('%Y-%m', 'now') as current_month,
    COUNT(DISTINCT client_id) as active_subscriptions,
    SUM(
        CASE billing_cycle
            WHEN 'monthly' THEN price_per_period
            WHEN 'quarterly' THEN price_per_period / 3
            WHEN 'semi_annual' THEN price_per_period / 6
            WHEN 'annual' THEN price_per_period / 12
        END
    ) as mrr,
    SUM(
        CASE billing_cycle
            WHEN 'annual' THEN price_per_period
            WHEN 'semi_annual' THEN price_per_period * 2
            WHEN 'quarterly' THEN price_per_period * 4
            WHEN 'monthly' THEN price_per_period * 12
        END
    ) as arr
FROM subscriptions
WHERE status = 'active';
```

#### 5. Stripe Integration Worker

```typescript
// workers/stripe-handler.ts
import { Env } from './types';
import Stripe from 'stripe';

export interface StripeWebhookEvent {
  id: string;
  type: string;
  data: {
    object: any;
  };
}

export async function handleStripeWebhook(
  request: Request,
  env: Env
): Promise<Response> {
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
  });

  try {
    // Verify webhook signature
    const signature = request.headers.get('stripe-signature');
    if (!signature) {
      return new Response('Missing signature', { status: 400 });
    }

    const body = await request.text();
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      env.STRIPE_WEBHOOK_SECRET
    );

    // Handle different event types
    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object, env);
        break;
      
      case 'invoice.payment_succeeded':
        await handleInvoicePayment(event.data.object, env);
        break;
      
      case 'subscription.created':
      case 'subscription.updated':
        await handleSubscriptionChange(event.data.object, env);
        break;
      
      case 'subscription.deleted':
        await handleSubscriptionCancellation(event.data.object, env);
        break;
      
      case 'payment_intent.payment_failed':
        await handlePaymentFailure(event.data.object, env);
        break;
      
      case 'customer.subscription.trial_will_end':
        await handleTrialEndingSoon(event.data.object, env);
        break;
      
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), { 
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ error: 'Webhook handler failed' }), 
      { status: 500 }
    );
  }
}

async function handlePaymentSuccess(
  paymentIntent: Stripe.PaymentIntent, 
  env: Env
): Promise<void> {
  // Record successful payment
  const result = await env.DB.prepare(`
    INSERT INTO payments (
      client_id, 
      amount, 
      payment_date,
      payment_method, 
      stripe_payment_intent_id,
      status,
      currency_code
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(
    paymentIntent.metadata.client_id,
    paymentIntent.amount / 100, // Convert from cents
    new Date().toISOString(),
    'stripe',
    paymentIntent.id,
    'completed',
    paymentIntent.currency.toUpperCase()
  ).run();

  // Update invoice if linked
  if (paymentIntent.metadata.invoice_id) {
    await env.DB.prepare(`
      UPDATE invoices 
      SET status = 'paid', 
          paid_date = CURRENT_TIMESTAMP,
          updated_at = CURRENT_TIMESTAMP
      WHERE invoice_id = ?
    `).bind(paymentIntent.metadata.invoice_id).run();
  }

  // Trigger success notification via n8n
  await triggerPaymentNotification(paymentIntent, 'success', env);
}

async function handleSubscriptionChange(
  subscription: Stripe.Subscription,
  env: Env
): Promise<void> {
  const existingSub = await env.DB.prepare(`
    SELECT subscription_id 
    FROM subscriptions 
    WHERE stripe_subscription_id = ?
  `).bind(subscription.id).first();

  if (existingSub) {
    // Update existing subscription
    await env.DB.prepare(`
      UPDATE subscriptions SET
        status = ?,
        current_period_start = ?,
        current_period_end = ?,
        price_per_period = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE stripe_subscription_id = ?
    `).bind(
      subscription.status,
      new Date(subscription.current_period_start * 1000).toISOString(),
      new Date(subscription.current_period_end * 1000).toISOString(),
      subscription.items.data[0].price.unit_amount / 100,
      subscription.id
    ).run();
  } else {
    // Create new subscription record
    await env.DB.prepare(`
      INSERT INTO subscriptions (
        client_id,
        package_id,
        stripe_subscription_id,
        status,
        start_date,
        current_period_start,
        current_period_end,
        billing_cycle,
        price_per_period
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      subscription.metadata.client_id,
      subscription.metadata.package_id,
      subscription.id,
      subscription.status,
      new Date(subscription.start_date * 1000).toISOString(),
      new Date(subscription.current_period_start * 1000).toISOString(),
      new Date(subscription.current_period_end * 1000).toISOString(),
      getbillingCycle(subscription.items.data[0].price.recurring?.interval),
      subscription.items.data[0].price.unit_amount / 100
    ).run();
  }

  // Log subscription event
  await env.DB.prepare(`
    INSERT INTO subscription_events (
      subscription_id,
      event_type,
      metadata
    ) VALUES (
      (SELECT subscription_id FROM subscriptions WHERE stripe_subscription_id = ?),
      ?,
      ?
    )
  `).bind(
    subscription.id,
    subscription.status === 'active' ? 'activated' : 'updated',
    JSON.stringify({ stripe_status: subscription.status })
  ).run();
}

function getBillingCycle(interval: string | undefined): string {
  switch(interval) {
    case 'month': return 'monthly';
    case 'year': return 'annual';
    case 'week': return 'weekly';
    default: return 'monthly';
  }
}

async function triggerPaymentNotification(
  payment: any,
  status: string,
  env: Env
): Promise<void> {
  const webhookUrl = env.N8N_WEBHOOK_URL + '/payment-notification';
  
  await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      paymentId: payment.id,
      amount: payment.amount / 100,
      status: status,
      clientId: payment.metadata.client_id,
      timestamp: new Date().toISOString()
    })
  });
}
```

### 🎯 Testing and Validation

```sql
-- Test data insertion
INSERT INTO service_packages (package_name, package_type, price_usd, session_count, duration_months)
VALUES 
  ('Executive Presence Package', 'standard', 2500.00, 6, 2),
  ('Public Speaking Bootcamp', 'standard', 3500.00, 8, 3),
  ('Leadership Communication', 'standard', 4500.00, 12, 3),
  ('Custom Corporate Training', 'custom', 10000.00, 20, 6);

INSERT INTO discount_codes (code, discount_type, discount_value, valid_from, valid_until)
VALUES 
  ('EARLY2024', 'percentage', 15, '2024-01-01', '2024-03-31'),
  ('NEWYEAR25', 'fixed_amount', 250, '2024-12-15', '2025-01-31'),
  ('TRIAL30', 'free_trial', 30, '2024-01-01', '2024-12-31');

-- Validation queries
-- Check invoice balance calculations
SELECT 
  i.invoice_number,
  i.total_amount,
  COALESCE(SUM(p.amount), 0) as paid_amount,
  i.total_amount - COALESCE(SUM(p.amount), 0) as balance
FROM invoices i
LEFT JOIN payments p ON i.invoice_id = p.invoice_id
GROUP BY i.invoice_id
HAVING balance != 0;

-- Verify MRR calculation
SELECT 
  COUNT(*) as active_subs,
  SUM(price_per_period) as total_monthly_revenue
FROM subscriptions
WHERE status = 'active'
  AND billing_cycle = 'monthly';

-- Test discount code usage
UPDATE discount_codes 
SET current_uses = current_uses + 1
WHERE code = 'EARLY2024'
  AND is_active = 1
  AND current_uses < max_uses
  AND date('now') BETWEEN valid_from AND valid_until;
```

### 📊 Performance Monitoring

```typescript
// Monitor financial query performance
export async function monitorFinancialPerformance(env: Env) {
  const criticalQueries = [
    {
      name: 'Revenue Summary',
      sql: 'SELECT * FROM revenue_summary LIMIT 12'
    },
    {
      name: 'Outstanding Invoices',
      sql: 'SELECT * FROM outstanding_invoices WHERE aging_status = "Overdue"'
    },
    {
      name: 'MRR Calculation',
      sql: 'SELECT * FROM mrr_calculation'
    },
    {
      name: 'Payment Search',
      sql: `SELECT * FROM payments 
            WHERE payment_date >= date('now', '-30 days') 
            ORDER BY payment_date DESC LIMIT 100`
    }
  ];

  const metrics = [];
  
  for (const query of criticalQueries) {
    const start = Date.now();
    const result = await env.DB.prepare(query.sql).all();
    const duration = Date.now() - start;
    
    metrics.push({
      query: query.name,
      duration,
      rowCount: result.results.length,
      slow: duration > 100
    });
  }

  // Alert if any queries are slow
  const slowQueries = metrics.filter(m => m.slow);
  if (slowQueries.length > 0) {
    console.warn('Slow financial queries detected:', slowQueries);
  }

  return metrics;
}

// Daily financial reconciliation
export async function dailyFinancialReconciliation(env: Env) {
  const reconciliation = {
    date: new Date().toISOString().split('T')[0],
    checks: [],
    errors: []
  };

  // Check 1: Verify all Stripe payments are recorded
  const stripePayments = await fetchStripePayments(env);
  const dbPayments = await env.DB.prepare(`
    SELECT stripe_payment_intent_id 
    FROM payments 
    WHERE payment_date >= date('now', '-1 day')
  `).all();

  const dbPaymentIds = new Set(dbPayments.results.map(p => p.stripe_payment_intent_id));
  const missingPayments = stripePayments.filter(p => !dbPaymentIds.has(p.id));
  
  if (missingPayments.length > 0) {
    reconciliation.errors.push({
      type: 'missing_payments',
      count: missingPayments.length,
      ids: missingPayments.map(p => p.id)
    });
  }

  // Check 2: Verify invoice totals match line items
  const invoiceCheck = await env.DB.prepare(`
    SELECT 
      i.invoice_id,
      i.total_amount,
      SUM(ii.line_total) as calculated_total
    FROM invoices i
    LEFT JOIN invoice_items ii ON i.invoice_id = ii.invoice_id
    GROUP BY i.invoice_id
    HAVING i.total_amount != calculated_total
  `).all();

  if (invoiceCheck.results.length > 0) {
    reconciliation.errors.push({
      type: 'invoice_mismatch',
      count: invoiceCheck.results.length,
      invoices: invoiceCheck.results
    });
  }

  reconciliation.checks.push(
    { name: 'payment_sync', passed: missingPayments.length === 0 },
    { name: 'invoice_totals', passed: invoiceCheck.results.length === 0 }
  );

  return reconciliation;
}
```

### 🔒 Security Considerations

```typescript
// PCI compliance helpers
export function maskCardNumber(cardNumber: string): string {
  if (!cardNumber || cardNumber.length < 4) return '****';
  return '**** **** **** ' + cardNumber.slice(-4);
}

// Never store full card details - use tokenization
export async function tokenizePaymentMethod(
  cardDetails: any,
  env: Env
): Promise<string> {
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  
  // Create payment method with Stripe
  const paymentMethod = await stripe.paymentMethods.create({
    type: 'card',
    card: {
      number: cardDetails.number,
      exp_month: cardDetails.exp_month,
      exp_year: cardDetails.exp_year,
      cvc: cardDetails.cvc
    }
  });

  // Store only token reference
  await env.DB.prepare(`
    INSERT INTO payment_methods (
      client_id,
      method_type,
      stripe_payment_method_id,
      last_four,
      brand,
      exp_month,
      exp_year
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `).bind(
    cardDetails.client_id,
    'card',
    paymentMethod.id,
    paymentMethod.card.last4,
    paymentMethod.card.brand,
    paymentMethod.card.exp_month,
    paymentMethod.card.exp_year
  ).run();

  return paymentMethod.id;
}

// Audit trail for financial operations
export async function logFinancialAudit(
  operation: string,
  details: any,
  env: Env
): Promise<void> {
  await env.DB.prepare(`
    INSERT INTO financial_audit_log (
      operation_type,
      record_id,
      user_id,
      ip_address,
      details,
      timestamp
    ) VALUES (?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
  `).bind(
    operation,
    details.recordId,
    details.userId,
    details.ipAddress,
    JSON.stringify(details)
  ).run();
}
```

### ✅ Success Validation Checklist

- [ ] All financial tables created with proper constraints
- [ ] Stripe webhook handler deployed and tested
- [ ] Payment tokenization implemented (no raw card data stored)
- [ ] Invoice calculations verified and balanced
- [ ] Subscription lifecycle management working
- [ ] Discount code application tested
- [ ] Revenue reporting views return accurate data
- [ ] MRR/ARR calculations validated
- [ ] Daily reconciliation process scheduled
- [ ] PCI compliance measures implemented

### 🔗 Next Steps Integration

1. **Story 2.5**: Build automation and logging tables for audit trails
2. **Story 3.3**: Connect forms to payment processing
3. **Story 3.6**: Implement email notifications for financial events
4. **Story 4.4**: Add financial management to admin interface
5. **Story 5.3**: Optimize financial queries for performance

## Migration Script from Existing Systems

```javascript
// migration/migrate-financial-data.js
export async function migrateFinancialData(env) {
  console.log('Starting financial data migration...');
  
  // Migrate from Airtable
  const tables = ['Invoices', 'Payments', 'Packages'];
  
  for (const table of tables) {
    const response = await fetch(
      `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/${table}`,
      {
        headers: {
          'Authorization': `Bearer ${env.AIRTABLE_API_KEY}`
        }
      }
    );
    
    const data = await response.json();
    
    if (table === 'Invoices') {
      for (const record of data.records) {
        await migrateInvoice(record.fields, env);
      }
    } else if (table === 'Payments') {
      for (const record of data.records) {
        await migratePayment(record.fields, env);
      }
    }
  }
  
  // Sync with Stripe for current subscriptions
  const stripe = new Stripe(env.STRIPE_SECRET_KEY);
  const subscriptions = await stripe.subscriptions.list({ limit: 100 });
  
  for (const sub of subscriptions.data) {
    await env.DB.prepare(`
      INSERT OR REPLACE INTO subscriptions (
        stripe_subscription_id,
        client_id,
        status,
        current_period_start,
        current_period_end,
        price_per_period
      ) VALUES (?, ?, ?, ?, ?, ?)
    `).bind(
      sub.id,
      sub.metadata.client_id,
      sub.status,
      new Date(sub.current_period_start * 1000).toISOString(),
      new Date(sub.current_period_end * 1000).toISOString(),
      sub.items.data[0].price.unit_amount / 100
    ).run();
  }
  
  console.log('Financial data migration completed');
}

async function migrateInvoice(invoice: any, env: Env) {
  await env.DB.prepare(`
    INSERT INTO invoices (
      invoice_number,
      client_id,
      invoice_date,
      due_date,
      total_amount,
      status
    ) VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    invoice['Invoice Number'],
    invoice['Client'][0], // Airtable linked record
    invoice['Invoice Date'],
    invoice['Due Date'],
    invoice['Total'],
    mapInvoiceStatus(invoice['Status'])
  ).run();
}

function mapInvoiceStatus(airtableStatus: string): string {
  const statusMap: Record<string, string> = {
    'Draft': 'draft',
    'Sent': 'sent',
    'Paid': 'paid',
    'Overdue': 'overdue',
    'Cancelled': 'cancelled'
  };
  return statusMap[airtableStatus] || 'draft';
}
```

## Resources and References

- [SaaS Database Design Guide](https://aloa.co/blog/saas-database-design)
- [Billing System Architecture](https://www.roastmypricingpage.com/blog/saas-billing-architecture)
- [Stripe Webhooks Documentation](https://stripe.com/docs/webhooks)
- [PCI Compliance Guidelines](https://www.pcisecuritystandards.org/)
- [Financial Reporting Best Practices](https://www.prophix.com/blog/best-financial-reporting-software-tools/)