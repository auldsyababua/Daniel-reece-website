# n8n Workflow Documentation

## Workflow Overview

### 1. New Lead Workflow
**File**: `new-lead-workflow.json`  
**Trigger**: Webhook from contact form  
**Purpose**: Automate lead capture and follow-up

#### Flow:
1. Receives contact form submission via webhook
2. Creates lead record in Airtable
3. Sends notification email to Daniel
4. Sends confirmation email to lead
5. Waits 24 hours
6. Checks if lead status is still "New"
7. If yes, sends follow-up email and updates status

#### Key Features:
- Lead scoring based on title keywords (CEO, Director, VP)
- Automatic follow-up if no response
- Tracks all interactions in Airtable

---

### 2. Calendar Integration Workflow
**File**: `calendar-integration-workflow.json`  
**Trigger**: Every 15 minutes OR manual webhook  
**Purpose**: Sync calendar events with Airtable sessions

#### Flow:
1. Checks for Cal.com API key or Google Calendar
2. Fetches recent calendar events (last 15 minutes)
3. Processes events into session format
4. Checks if session already exists in Airtable
5. Creates new session or updates existing
6. Links session to client record

#### Key Features:
- Supports both Cal.com and Google Calendar
- Prevents duplicate sessions
- Automatic client linking

---

### 3. Daily Automations Workflow
**File**: `daily-automations-workflow.json`  
**Trigger**: 9 AM and 6 PM EST daily  
**Purpose**: Payment capture and session reminders

#### Morning (9 AM):
1. Gets today's sessions
2. Processes payments due for capture
3. Captures payments via Stripe
4. Updates payment status in Airtable
5. Sends morning report to Daniel

#### Evening (6 PM):
1. Gets tomorrow's sessions
2. Sends reminder emails to clients
3. Updates reminder status
4. Sends evening report to Daniel

#### Key Features:
- Configurable payment capture timing
- Personalized reminder emails
- Daily summary reports

---

### 4. Email Sequences Workflow
**File**: `email-sequences-workflow.json`  
**Trigger**: Hourly check OR manual webhook  
**Purpose**: Automated email marketing sequences

#### Sequences:

**Welcome Series** (New contacts):
- Email 1: Immediate - Welcome & value proposition
- Email 2: Day 3 - Three executive techniques
- Email 3: Day 7 - Case study & PREP framework
- Email 4: Day 14 - Consultation invitation

**Post-Session** (After sessions):
- Email 1: Immediate - Thank you & action plan
- Email 2: Day 3 - Check-in on progress
- Email 3: Day 7 - Package upgrade offer

**Upsell** (Single session clients):
- Sent 30 days after last contact
- Special package discount offer

#### Key Features:
- Dynamic email templates
- Automatic sequence progression
- Personalization with client data

---

## Error Handling

All workflows include error handling that:
1. Captures execution errors
2. Sends notification to admin email
3. Logs error details for debugging
4. Continues processing other items

### Error Notification Webhook
**Endpoint**: `/webhook/error-notification`  
**Purpose**: Centralized error handling

Receives error data and:
- Formats error message
- Sends SMS if critical
- Creates error log in Airtable
- Sends detailed email to admin

---

## Workflow Management

### Activation Order
1. First: Error handling workflow
2. Second: Calendar integration
3. Third: New lead workflow
4. Fourth: Daily automations
5. Last: Email sequences

### Testing Order
1. Test webhooks with curl commands
2. Verify Airtable connections
3. Test email sending
4. Run manual calendar sync
5. Trigger test sequences

### Monitoring
- Check executions tab daily
- Review error notifications
- Monitor email open rates
- Track conversion metrics

---

## Data Flow

```
Website Form → Webhook → n8n → Airtable → Email/SMS
                           ↓
                        Stripe
                           ↓
                     Calendar Sync
```

---

## Customization Guide

### Adding New Email Templates
1. Edit `email-sequences-workflow.json`
2. Find the "Get Email Template Content" node
3. Add new template to the templates object
4. Update sequence logic in "Process Email Sequences"

### Modifying Schedules
1. Edit cron expressions in trigger nodes
2. Remember times are in EST (America/New_York)
3. Test with manual execution first

### Adding Webhook Endpoints
1. Create new webhook node
2. Set authentication to "Header Auth"
3. Use same webhook token credential
4. Document endpoint in setup guide

---

## Performance Optimization

### Current Optimizations:
- 15-minute calendar polling (not real-time)
- Hourly email sequence checks
- Batch processing for multiple items
- SQLite database for free tier

### Scaling Considerations:
- Upgrade to PostgreSQL for >1000 contacts
- Reduce polling intervals for faster sync
- Add Redis for queue management
- Implement webhook-based calendar updates

---

## Backup and Recovery

### Backup Strategy:
1. Export workflows weekly
2. Backup SQLite database daily
3. Keep Airtable as source of truth
4. Document all customizations

### Recovery Process:
1. Deploy fresh n8n instance
2. Import workflow JSONs
3. Restore database
4. Reconfigure credentials
5. Test all endpoints

---

## Integration Points

### Netlify Functions
- Send webhooks to n8n endpoints
- Include webhook token in headers
- Handle n8n responses

### Stripe Webhooks
- Configure Stripe to send events to n8n
- Process payment confirmations
- Update Airtable records

### Calendar Services
- Cal.com: API key required
- Google: OAuth2 setup needed
- Consider webhook subscriptions

---

## Future Enhancements

### Planned Features:
1. SMS notifications via Twilio
2. Advanced lead scoring
3. A/B testing for emails
4. Conversion tracking
5. Custom reporting dashboard

### Integration Ideas:
1. Slack notifications
2. CRM sync (HubSpot/Salesforce)
3. Zoom meeting creation
4. Invoice generation
5. Client portal access