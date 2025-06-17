# n8n Automation for Executive Speech Coaching NYC

Cost-effective automation workflows replacing expensive Zapier subscriptions.

## 🚀 Quick Start

1. **Deploy n8n** to Railway or Render (see `/docs/setup-guide.md`)
2. **Set environment variables** from `.env.example`
3. **Import workflows** from `/workflows` directory
4. **Configure credentials** in n8n interface
5. **Test webhooks** and activate workflows

## 📁 Project Structure

```
n8n/
├── README.md                         # This file
├── deploy/                          # Deployment configurations
│   ├── railway.json                # Railway deployment config
│   ├── render.yaml                 # Render deployment config
│   └── Dockerfile                  # Docker configuration
├── workflows/                      # n8n workflow JSON files
│   ├── new-lead-workflow.json     # Lead capture and follow-up
│   ├── calendar-integration-workflow.json  # Calendar sync
│   ├── daily-automations-workflow.json    # Payment & reminders
│   ├── email-sequences-workflow.json      # Email marketing
│   └── error-handling-workflow.json       # Error notifications
└── docs/                          # Documentation
    ├── setup-guide.md            # Complete setup instructions
    └── workflow-documentation.md # Detailed workflow docs
```

## 🔧 Key Features

### Lead Management
- Automatic lead capture from website forms
- Airtable CRM integration
- 24-hour follow-up automation
- Lead scoring based on title/company

### Calendar Integration
- Supports Google Calendar and Cal.com
- 15-minute sync intervals
- Automatic session creation in Airtable
- Prevents duplicate bookings

### Payment Automation
- Stripe payment capture on session day
- Configurable capture timing
- Payment status tracking
- Failed payment notifications

### Email Marketing
- Welcome series for new contacts
- Post-session follow-ups
- Package upsell campaigns
- Dynamic personalization

### Error Handling
- Real-time error notifications
- SMS alerts for critical errors
- Daily error summaries
- Airtable error logging

## 💰 Cost Comparison

| Service | Zapier | n8n (Railway) | Savings |
|---------|--------|---------------|---------|
| Monthly | $49+   | ~$5          | ~$44    |
| Annual  | $588+  | ~$60         | ~$528   |

## 🔐 Security

- Webhook token authentication
- Environment variable encryption
- Basic auth for n8n access
- No sensitive data in workflows

## 📊 Required Services

- **Airtable**: CRM database
- **Gmail**: Email sending (app password)
- **Stripe**: Payment processing
- **Cal.com** or **Google Calendar**: Booking management

## 🚨 Important Notes

1. **Free Tier Limits**: 
   - Render: May have cold starts
   - Railway: Requires payment method

2. **API Limits**:
   - Airtable: 5 requests/second
   - Gmail: 250 quota units/user/second
   - Stripe: No hard limits

3. **Data Retention**:
   - Execution logs: 7 days
   - Error logs: Permanent in Airtable

## 📝 Environment Variables

Critical variables that must be set:
```bash
N8N_BASIC_AUTH_USER
N8N_BASIC_AUTH_PASSWORD
N8N_ENCRYPTION_KEY (32 chars)
N8N_WEBHOOK_TOKEN
AIRTABLE_API_KEY
AIRTABLE_BASE_ID
SMTP_USER
SMTP_PASS
```

See `.env.example` for complete list.

## 🧪 Testing

Test webhooks with provided curl commands:
```bash
# Test contact form
curl -X POST https://your-n8n.railway.app/webhook/contact-form \
  -H "X-Webhook-Token: your_token" \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com"}'
```

## 📚 Resources

- [n8n Documentation](https://docs.n8n.io)
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [Airtable API](https://airtable.com/api)

## 🤝 Support

1. Check workflow executions in n8n
2. Review error notifications
3. Consult documentation in `/docs`
4. Check n8n community forums

---

Built with ❤️ to save money and increase automation capabilities.