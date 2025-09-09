# User Story 003-1: Cloudflare Workers Form Handler Development

## User Story
**As a** website visitor  
**I want** to submit contact forms that are processed immediately  
**So that** my inquiry is captured and acknowledged quickly

## Acceptance Criteria
1. ✅ Cloudflare Worker created for form processing at `/api/contact`
2. ✅ Worker validates form data (name, email, message required)
3. ✅ Form submissions stored in D1 `form_submissions` table
4. ✅ Email validation prevents spam and invalid submissions
5. ✅ Rate limiting prevents form abuse (max 5 submissions per IP per hour)
6. ✅ CORS headers configured for cross-origin requests
7. ✅ JSON response provides success/error feedback to frontend
8. ✅ Worker handles both Contact and Newsletter subscription forms
9. ✅ Sanitization prevents XSS and injection attacks
10. ✅ Request logging for debugging and monitoring
11. ⏳ Contact form displays Dan's business phone number and address with "calls & SMS welcome" messaging
12. ⏳ Optional form fields (phone, company, service interest) hidden in collapsible dropdown
13. ⏳ Dropdown button labeled "Optional Information to Better Assist You"
14. ⏳ Phone number added to top navigation
15. ⏳ Business contact information prominently displayed on contact page

## Implementation Guide

### 🔧 Required Tools & MCPs
- **Wrangler CLI**: Worker development and deployment
- **mcp__n8n-cloud__**: Workflow automation integration
- **mcp__github__**: Code versioning and deployment tracking
- **Hono Framework**: Lightweight Worker framework

### 📋 Step-by-Step Implementation

#### 1. Worker Project Structure Setup
```bash
# Create Workers directory
mkdir -p workers/forms
cd workers/forms

# Initialize package.json
cat > package.json << 'EOF'
{
  "name": "dan-reece-form-workers",
  "version": "1.0.0",
  "scripts": {
    "dev": "wrangler dev --local --port 8787",
    "deploy": "wrangler deploy --env production",
    "deploy:staging": "wrangler deploy --env staging"
  },
  "dependencies": {
    "hono": "^3.11.7",
    "dompurify": "^3.0.5",
    "validator": "^13.11.0"
  },
  "devDependencies": {
    "@cloudflare/workers-types": "^4.20231121.0"
  }
}
EOF

npm install
```

#### 2. Wrangler Configuration
**Enhanced `wrangler.toml`:**
```toml
name = "dan-reece-forms"
main = "src/index.js"
compatibility_date = "2024-01-01"
compatibility_flags = ["nodejs_compat"]

# D1 Database binding
[[d1_databases]]
binding = "DB"
database_name = "dan-reece-coaching-db"
database_id = "your-database-id"
migrations_dir = "../../migrations"

# KV for rate limiting
[[kv_namespaces]]
binding = "RATE_LIMITER"
id = "your-kv-namespace-id"

# Environment variables
[vars]
ENVIRONMENT = "development"
MAX_SUBMISSIONS_PER_HOUR = "5"
ALLOWED_ORIGINS = "https://executivespeechcoachingnyc.com,https://www.executivespeechcoachingnyc.com"

# Staging environment
[env.staging]
name = "dan-reece-forms-staging"
[env.staging.vars]
ENVIRONMENT = "staging"

# Production environment  
[env.production]
name = "dan-reece-forms-production"
[env.production.vars]
ENVIRONMENT = "production"
MAX_SUBMISSIONS_PER_HOUR = "3"

# Production D1 database
[env.production.d1_databases]
binding = "DB"
database_name = "dan-reece-coaching-db"
database_id = "your-production-database-id"

# Production KV
[env.production.kv_namespaces]
binding = "RATE_LIMITER"  
id = "your-production-kv-namespace-id"
```

#### 3. Core Worker Implementation
**Create `src/index.js`:**
```javascript
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { rateLimiter } from 'hono/rate-limiter'
import { validator } from 'hono/validator'
import DOMPurify from 'dompurify'
import validatorLib from 'validator'

// TypeScript-style bindings for better development experience
interface Env {
  DB: D1Database
  RATE_LIMITER: KVNamespace
  ENVIRONMENT: string
  MAX_SUBMISSIONS_PER_HOUR: string
  ALLOWED_ORIGINS: string
  N8N_WEBHOOK_CONTACT?: string
  N8N_WEBHOOK_NEWSLETTER?: string
}

const app = new Hono<{ Bindings: Env }>()

// CORS configuration
app.use('*', cors({
  origin: (origin, c) => {
    const allowedOrigins = c.env.ALLOWED_ORIGINS?.split(',') || ['https://executivespeechcoachingnyc.com']
    return allowedOrigins.includes(origin) ? origin : null
  },
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  exposeHeaders: ['X-Rate-Limit-Remaining'],
  credentials: false,
}))

// Rate limiting middleware
async function checkRateLimit(c, next) {
  const clientIP = c.req.header('CF-Connecting-IP') || c.req.header('X-Forwarded-For') || 'unknown'
  const rateLimitKey = `rate_limit:${clientIP}:${Math.floor(Date.now() / 3600000)}` // Per hour
  
  try {
    const currentCount = await c.env.RATE_LIMITER.get(rateLimitKey)
    const maxSubmissions = parseInt(c.env.MAX_SUBMISSIONS_PER_HOUR) || 5
    
    if (currentCount && parseInt(currentCount) >= maxSubmissions) {
      return c.json({ 
        success: false, 
        error: 'Rate limit exceeded. Please try again later.',
        retryAfter: 3600
      }, 429)
    }
    
    // Increment counter
    const newCount = currentCount ? parseInt(currentCount) + 1 : 1
    await c.env.RATE_LIMITER.put(rateLimitKey, newCount.toString(), { expirationTtl: 3600 })
    
    // Add rate limit info to response headers
    c.header('X-Rate-Limit-Remaining', (maxSubmissions - newCount).toString())
    
    await next()
  } catch (error) {
    console.error('Rate limiting error:', error)
    await next() // Continue on rate limit errors
  }
}

// Input validation and sanitization
const formValidator = validator('json', (value, c) => {
  const { name, email, message, formType = 'contact' } = value
  
  // Required field validation
  if (!name || !email || !message) {
    return c.json({ 
      success: false, 
      error: 'Missing required fields: name, email, and message are required' 
    }, 400)
  }
  
  // Email validation
  if (!validatorLib.isEmail(email)) {
    return c.json({ 
      success: false, 
      error: 'Invalid email address format' 
    }, 400)
  }
  
  // Length validation
  if (name.length > 100) {
    return c.json({ 
      success: false, 
      error: 'Name must be less than 100 characters' 
    }, 400)
  }
  
  if (message.length > 5000) {
    return c.json({ 
      success: false, 
      error: 'Message must be less than 5000 characters' 
    }, 400)
  }
  
  // Form type validation
  const validFormTypes = ['contact', 'newsletter', 'discovery', 'consultation']
  if (!validFormTypes.includes(formType)) {
    return c.json({ 
      success: false, 
      error: 'Invalid form type' 
    }, 400)
  }
  
  return {
    name: DOMPurify.sanitize(name.trim()),
    email: email.trim().toLowerCase(),
    message: DOMPurify.sanitize(message.trim()),
    formType: formType.trim().toLowerCase(),
    // Optional fields
    phone: value.phone ? DOMPurify.sanitize(value.phone.trim()) : null,
    company: value.company ? DOMPurify.sanitize(value.company.trim()) : null,
    serviceInterest: value.serviceInterest ? DOMPurify.sanitize(value.serviceInterest.trim()) : null
  }
})

// Main contact form endpoint
app.post('/api/contact', checkRateLimit, formValidator, async (c) => {
  const formData = c.req.valid('json')
  const clientIP = c.req.header('CF-Connecting-IP') || 'unknown'
  const userAgent = c.req.header('User-Agent') || 'unknown'
  const referer = c.req.header('Referer') || null
  
  try {
    // Insert into D1 database
    const result = await c.env.DB.prepare(`
      INSERT INTO form_submissions (
        name, email, message, form_type, phone, company, 
        service_interest, client_ip, user_agent, referer, submitted_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      formData.name,
      formData.email, 
      formData.message,
      formData.formType,
      formData.phone,
      formData.company,
      formData.serviceInterest,
      clientIP,
      userAgent,
      referer
    ).run()
    
    const submissionId = result.meta.last_row_id
    
    // Log successful submission
    await logFormSubmission(c.env.DB, {
      submissionId,
      type: 'form_submitted',
      status: 'success',
      clientIP,
      formType: formData.formType
    })
    
    // Trigger n8n webhook if configured
    if (c.env.N8N_WEBHOOK_CONTACT) {
      triggerN8nWebhook({
        ...formData,
        submissionId,
        clientIP,
        timestamp: new Date().toISOString(),
        source: 'contact-form'
      }, c.env.N8N_WEBHOOK_CONTACT, c.env.DB)
        .catch(error => console.error('n8n webhook failed:', error))
    }
    
    return c.json({
      success: true,
      message: 'Thank you for your message! We\'ll get back to you within 24 hours.',
      submissionId: submissionId,
      nextSteps: getNextStepsMessage(formData.formType)
    })
    
  } catch (error) {
    console.error('Database error:', error)
    
    // Log error
    await logFormSubmission(c.env.DB, {
      type: 'database_error',
      status: 'error',
      error: error.message,
      clientIP,
      formType: formData.formType
    }).catch(() => {}) // Ignore logging errors
    
    return c.json({ 
      success: false, 
      error: 'Unable to process your submission. Please try again or contact us directly.' 
    }, 500)
  }
})

// Newsletter subscription endpoint
app.post('/api/newsletter', checkRateLimit, validator('json', (value, c) => {
  const { email, name = '', interests = [] } = value
  
  if (!email || !validatorLib.isEmail(email)) {
    return c.json({ 
      success: false, 
      error: 'Valid email address is required' 
    }, 400)
  }
  
  return {
    email: email.trim().toLowerCase(),
    name: name ? DOMPurify.sanitize(name.trim()) : '',
    interests: Array.isArray(interests) ? interests.map(i => DOMPurify.sanitize(i)) : []
  }
}), async (c) => {
  const { email, name, interests } = c.req.valid('json')
  const clientIP = c.req.header('CF-Connecting-IP') || 'unknown'
  
  try {
    // Check for existing subscription
    const existingSubscription = await c.env.DB.prepare(
      'SELECT id FROM form_submissions WHERE email = ? AND form_type = ? AND submitted_at > datetime("now", "-7 days")'
    ).bind(email, 'newsletter').first()
    
    if (existingSubscription) {
      return c.json({
        success: false,
        error: 'This email is already subscribed to our newsletter'
      }, 409)
    }
    
    // Insert newsletter subscription
    const result = await c.env.DB.prepare(`
      INSERT INTO form_submissions (
        name, email, message, form_type, client_ip, submitted_at
      ) VALUES (?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      name || 'Newsletter Subscriber',
      email,
      `Newsletter subscription. Interests: ${interests.join(', ')}`,
      'newsletter',
      clientIP
    ).run()
    
    // Trigger newsletter workflow
    if (c.env.N8N_WEBHOOK_NEWSLETTER) {
      triggerN8nWebhook({
        email, name, interests,
        submissionId: result.meta.last_row_id,
        timestamp: new Date().toISOString(),
        source: 'newsletter-signup'
      }, c.env.N8N_WEBHOOK_NEWSLETTER, c.env.DB)
        .catch(error => console.error('Newsletter webhook failed:', error))
    }
    
    return c.json({
      success: true,
      message: 'Successfully subscribed to our newsletter! Check your email for confirmation.'
    })
    
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return c.json({ 
      success: false, 
      error: 'Unable to process subscription. Please try again.' 
    }, 500)
  }
})

// Health check endpoint
app.get('/api/health', async (c) => {
  try {
    // Test database connection
    const dbTest = await c.env.DB.prepare('SELECT 1 as test').first()
    
    return c.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: dbTest ? 'connected' : 'disconnected',
      environment: c.env.ENVIRONMENT || 'unknown'
    })
  } catch (error) {
    return c.json({
      status: 'unhealthy', 
      error: error.message
    }, 500)
  }
})

// Utility functions
async function logFormSubmission(db, logData) {
  try {
    await db.prepare(`
      INSERT INTO automation_log (
        event_type, details, success, error_message, 
        source, timestamp
      ) VALUES (?, ?, ?, ?, ?, datetime('now'))
    `).bind(
      logData.type,
      JSON.stringify(logData),
      logData.status === 'success' ? 1 : 0,
      logData.error || null,
      'form-worker'
    ).run()
  } catch (error) {
    console.error('Logging error:', error)
  }
}

async function triggerN8nWebhook(formData, webhookUrl, db) {
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Cloudflare-Worker-Form-Handler/1.0'
      },
      body: JSON.stringify(formData)
    })
    
    if (!response.ok) {
      throw new Error(`Webhook failed: ${response.status} ${response.statusText}`)
    }
    
    // Log successful webhook
    await logFormSubmission(db, {
      type: 'webhook_triggered',
      status: 'success',
      webhookUrl: webhookUrl.replace(/\/[^\/]*$/, '/***'), // Hide sensitive path
      formType: formData.formType || 'unknown'
    })
    
  } catch (error) {
    console.error('n8n webhook error:', error)
    
    // Log failed webhook for retry
    await logFormSubmission(db, {
      type: 'webhook_failed',
      status: 'error',
      error: error.message,
      formData: formData,
      webhookUrl: webhookUrl.replace(/\/[^\/]*$/, '/***')
    })
  }
}

function getNextStepsMessage(formType) {
  const nextSteps = {
    contact: "We'll review your message and respond within 24 hours. Check your email for updates!",
    discovery: "We'll send you a calendar link to schedule your complimentary discovery call within 2 hours.",
    consultation: "Thank you for your interest in our services. We'll send you detailed information and next steps shortly.",
    newsletter: "Welcome to our community! You'll receive our latest insights on executive communication."
  }
  
  return nextSteps[formType] || nextSteps.contact
}

export default app
```

### 🎯 Testing and Validation

**Create `tests/form-worker-test.js`:**
```javascript
// Test suite for form worker
import { expect } from 'chai'

describe('Form Worker Tests', () => {
  let worker, env
  
  beforeEach(() => {
    env = {
      DB: mockD1Database(),
      RATE_LIMITER: mockKVNamespace(),
      ENVIRONMENT: 'test',
      MAX_SUBMISSIONS_PER_HOUR: '5',
      ALLOWED_ORIGINS: 'https://executivespeechcoachingnyc.com'
    }
  })
  
  it('should accept valid contact form submission', async () => {
    const formData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'I need help with presentation skills',
      formType: 'contact'
    }
    
    const response = await worker.fetch(new Request('https://worker/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    }), env)
    
    expect(response.status).to.equal(200)
    const result = await response.json()
    expect(result.success).to.be.true
    expect(result.submissionId).to.be.a('number')
  })
  
  it('should reject invalid email addresses', async () => {
    const formData = {
      name: 'John Doe',
      email: 'invalid-email',
      message: 'Test message'
    }
    
    const response = await worker.fetch(new Request('https://worker/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    }), env)
    
    expect(response.status).to.equal(400)
    const result = await response.json()
    expect(result.success).to.be.false
    expect(result.error).to.include('Invalid email')
  })
  
  it('should enforce rate limiting', async () => {
    // Simulate multiple submissions from same IP
    const requests = Array(6).fill().map(() => 
      worker.fetch(new Request('https://worker/api/contact', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'CF-Connecting-IP': '192.168.1.1'
        },
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          message: 'Test message'
        })
      }), env)
    )
    
    const responses = await Promise.all(requests)
    
    // First 5 should succeed, 6th should be rate limited
    expect(responses[5].status).to.equal(429)
  })
})
```

### 📊 Performance Monitoring

**Add monitoring capabilities:**
```javascript
// Add to worker - performance tracking
async function trackPerformanceMetrics(c, startTime, operation, success = true) {
  const duration = Date.now() - startTime
  
  await c.env.DB.prepare(`
    INSERT INTO performance_metrics (
      operation, duration_ms, success, timestamp
    ) VALUES (?, ?, ?, datetime('now'))
  `).bind(operation, duration, success ? 1 : 0).run()
    .catch(error => console.error('Metrics logging failed:', error))
}

// Usage in endpoints
app.post('/api/contact', async (c) => {
  const startTime = Date.now()
  try {
    // ... existing logic ...
    await trackPerformanceMetrics(c, startTime, 'contact_form', true)
  } catch (error) {
    await trackPerformanceMetrics(c, startTime, 'contact_form', false)
    throw error
  }
})
```

### 🔒 Security Features

**Additional security middleware:**
```javascript
// Honeypot field detection
function detectHoneypot(formData) {
  // Common honeypot field names
  const honeypotFields = ['website', 'url', 'homepage', 'address_hidden']
  return honeypotFields.some(field => formData[field])
}

// Content analysis for spam detection
function detectSpam(message) {
  const spamIndicators = [
    /\b(?:bitcoin|cryptocurrency|forex|investment)\b/i,
    /\b(?:make.*money|get.*rich|earn.*\$)\b/i,
    /\b(?:click.*here|visit.*now|limited.*time)\b/i
  ]
  
  return spamIndicators.some(pattern => pattern.test(message))
}
```

### ✅ Success Validation

**Deployment checklist:**
```bash
#!/bin/bash
# deploy-forms.sh - Deployment script

echo "🚀 Deploying form handlers..."

# Deploy to staging first
wrangler deploy --env staging

# Run staging tests
npm run test:staging

# Deploy to production if staging tests pass
if [ $? -eq 0 ]; then
  wrangler deploy --env production
  echo "✅ Production deployment successful"
else
  echo "❌ Staging tests failed, aborting production deployment"
  exit 1
fi

# Verify production health
curl -f https://dan-reece-forms.workers.dev/api/health || exit 1

echo "🎉 Deployment complete and verified!"
```

### 📋 Integration with MCP Tools

**Using n8n-cloud MCP for workflow management:**
```bash
# Use mcp__n8n-cloud__ to verify workflow setup
mcp__n8n-cloud__n8n_list_workflows --active true

# Create webhook integration workflow  
mcp__n8n-cloud__n8n_create_workflow \
  --name "Contact Form Processing" \
  --nodes '[
    {
      "id": "webhook",
      "type": "nodes-base.webhook", 
      "parameters": {"path": "contact-form"}
    },
    {
      "id": "email", 
      "type": "nodes-base.emailSend",
      "parameters": {"subject": "New Contact Form Submission"}
    }
  ]' \
  --connections '{"webhook": {"main": [["email"]]}}'
```

### 🔗 Next Steps Integration
- Form handler ready for Epic 003-2 frontend integration
- Database logging prepared for Epic 003-7 analytics
- n8n webhook triggers ready for Epic 003-4 workflow automation
- Security foundation established for production deployment