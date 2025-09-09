# Zapier Integration Setup Guide

## Executive Speech Coaching - Tally → Zapier → Airtable Integration

### Overview
This guide sets up automated lead capture and management using:
1. **Tally Forms** - Professional form capture with webhooks
2. **Zapier** - Automation and data processing middleware  
3. **Airtable** - CRM and lead management system

---

## Step 1: Tally Form Setup

### 1.1 Create Tally Account
- Go to [tally.so](https://tally.so)
- Sign up for free account
- Create new form: "Executive Coaching Contact Form"

### 1.2 Form Fields Configuration

**Contact Information Block**
- **Name** (Required, Text)
  - Label: "Full Name"
  - Placeholder: "Enter your full name"
  - Validation: Required, Min 2 characters

- **Email** (Required, Email)
  - Label: "Email Address"  
  - Placeholder: "your.email@company.com"
  - Validation: Required, Valid email format

- **Phone** (Optional, Phone)
  - Label: "Phone Number"
  - Placeholder: "+1 (555) 123-4567"

- **Company** (Optional, Text)
  - Label: "Company/Organization"
  - Placeholder: "Your company name"

- **Title** (Optional, Text)
  - Label: "Job Title"
  - Placeholder: "e.g. VP of Sales, CEO, Director"

**Service Interest Block**
- **Service** (Required, Single Choice)
  - Label: "What interests you most?"
  - Options:
    - 🎯 Discovery Call (Free 15-min consultation)
    - 👤 1:1 Executive Speech Coaching  
    - 🏢 Executive Training Programs
    - 👥 Group Communication Training
    - 💬 General Questions
    - 📋 Other (please specify)

**Qualification Questions Block**
- **Company Size** (Optional, Single Choice)
  - Label: "Company Size"
  - Options:
    - Enterprise (500+ employees)
    - Large (100-499 employees)
    - Medium (50-99 employees)  
    - Small (10-49 employees)
    - Startup (<10 employees)
    - Prefer not to say

- **Role Level** (Optional, Single Choice)
  - Label: "Your Role Level"
  - Options:
    - C-Level Executive (CEO, CFO, etc.)
    - Vice President / SVP
    - Director
    - Manager
    - Individual Contributor
    - Other

- **Timeline** (Optional, Single Choice)
  - Label: "When are you looking to start?"
  - Options:
    - Immediately (within 2 weeks)
    - Within 1 month
    - Within 3 months
    - Within 6 months
    - Just exploring options

**Message Block**
- **Message** (Required, Long Text)
  - Label: "Tell us about your goals"
  - Placeholder: "Share your communication challenges, goals, or questions..."
  - Validation: Required, Min 10 characters, Max 500 characters

### 1.3 Form Settings
- **Form Title**: "Let's Start Your Communication Journey"
- **Form Description**: "Get personalized coaching recommendations and a free consultation"
- **Submit Button**: "Send My Message"
- **Thank You Message**: "Thank you! We'll respond within 24 hours."
- **Redirect URL**: `https://yourdomain.com/contact/thank-you/`

### 1.4 Enable Webhook
1. Go to Form Settings → Integrations
2. Enable "Webhook"
3. Set webhook URL to: `https://hooks.zapier.com/hooks/catch/[YOUR-ZAPIER-WEBHOOK-ID]/`
4. Set trigger: "On form submission"
5. Test webhook to ensure it's working

---

## Step 2: Zapier Automation Setup

### 2.1 Create Zapier Account
- Sign up at [zapier.com](https://zapier.com)
- Choose the "Professional" plan for multi-step Zaps ($29.99/month)

### 2.2 Main Automation: Contact Form to Airtable

**Zap Name**: "Executive Coaching Lead Capture"

#### Trigger: Webhooks by Zapier
- **Event**: Catch Hook
- **Webhook URL**: Copy the provided URL to Tally
- **Test**: Submit a test form to populate sample data

#### Action 1: Lead Scoring (Code by Zapier)
```python
# Lead Scoring Algorithm
def calculate_lead_score(input_data):
    score = 0
    
    # Company Size Scoring
    company_size = input_data.get('company_size', '')
    company_scores = {
        'Enterprise (500+ employees)': 30,
        'Large (100-499 employees)': 20,
        'Medium (50-99 employees)': 15,
        'Small (10-49 employees)': 10,
        'Startup (<10 employees)': 5
    }
    score += company_scores.get(company_size, 0)
    
    # Role Level Scoring
    role_level = input_data.get('role_level', '')
    role_scores = {
        'C-Level Executive (CEO, CFO, etc.)': 40,
        'Vice President / SVP': 30,
        'Director': 20,
        'Manager': 15,
        'Individual Contributor': 10
    }
    score += role_scores.get(role_level, 5)
    
    # Service Interest Scoring
    service = input_data.get('service', '')
    if 'Discovery Call' in service:
        score += 15  # High intent
    elif 'Executive Training Programs' in service:
        score += 10  # High value
    elif '1:1 Executive Speech Coaching' in service:
        score += 5   # Medium value
    
    # Timeline Urgency
    timeline = input_data.get('timeline', '')
    timeline_scores = {
        'Immediately (within 2 weeks)': 20,
        'Within 1 month': 15,
        'Within 3 months': 10,
        'Within 6 months': 5
    }
    score += timeline_scores.get(timeline, 0)
    
    # Message Quality (keyword analysis)
    message = input_data.get('message', '').lower()
    if any(word in message for word in ['urgent', 'board', 'presentation', 'investor']):
        score += 10
    if any(word in message for word in ['budget', 'investment', 'approved']):
        score += 15
    if len(message) > 100:  # Detailed message
        score += 5
    
    # Determine priority level
    if score >= 80:
        priority = 'Hot'
    elif score >= 50:
        priority = 'Warm'
    else:
        priority = 'Cold'
    
    return {
        'lead_score': score,
        'priority_level': priority
    }

# Main execution
input_data = input
scoring_result = calculate_lead_score(input_data)
output = [{
    'lead_score': scoring_result['lead_score'],
    'priority_level': scoring_result['priority_level']
}]
```

#### Action 2: Create Record in Airtable
- **App**: Airtable
- **Action**: Create Record  
- **Base**: Executive Speech Coaching Leads
- **Table**: Leads

**Field Mapping**:
- Name → `{{name}}`
- Email → `{{email}}`
- Phone → `{{phone}}`
- Company → `{{company}}`
- Title → `{{title}}`
- Service Interest → `{{service}}`
- Message → `{{message}}`
- Lead Source → "Website Contact Form"
- Submission Date → `{{zap_meta_timestamp}}`
- Lead Score → `{{lead_score}}` (from Step 2)
- Priority Level → `{{priority_level}}` (from Step 2)
- Company Size → `{{company_size}}`
- Seniority Level → `{{role_level}}`
- Timeline → `{{timeline}}`
- Lead Status → "New"
- Follow-up Date → `{{zap_meta_timestamp + 1 day}}`

#### Action 3: Send Notification (Conditional)
- **Filter**: Only if Priority Level = "Hot"
- **App**: Email by Zapier or Slack
- **Action**: Send notification for immediate follow-up

### 2.3 Newsletter Signup Automation

**Zap Name**: "Newsletter Signup to Airtable"

#### Trigger: Tally (Newsletter Form)
- **Event**: New Form Response
- **Form**: Newsletter Signup Form

#### Action 1: Create Record in Airtable
- **Base**: Executive Speech Coaching Leads  
- **Table**: Newsletter Subscribers
- **Fields**:
  - Email → `{{email}}`
  - Name → `{{name}}` (if collected)
  - Subscription Date → `{{zap_meta_timestamp}}`
  - Status → "Active"
  - Source → "Website Footer"

#### Action 2: Send Welcome Email
- **App**: Email by Zapier
- **Template**: Welcome to Executive Speech Coaching newsletter

---

## Step 3: Airtable Base Setup

### 3.1 Create Airtable Account
- Sign up at [airtable.com](https://airtable.com)
- Create workspace: "Executive Speech Coaching"

### 3.2 Import Base Structure
1. Create new base: "Executive Speech Coaching Leads"
2. Follow the structure in `airtable-structure.md`
3. Set up views:
   - **Hot Leads**: Filter by Priority Level = "Hot"
   - **Follow-up Queue**: Filter by Follow-up Date = Today
   - **Pipeline**: Group by Lead Status
   - **This Month**: Filter by Submission Date = This Month

### 3.3 Automation Rules (Airtable)
- **Hot Lead Alert**: When Priority Level = "Hot", send email notification
- **Follow-up Reminder**: When Follow-up Date = Today, send reminder
- **Status Updates**: When Lead Status changes, log in Email History

---

## Step 4: Email Automation Setup

### 4.1 Auto-Responder Sequence

**Email 1: Immediate Response (0 minutes)**
```
Subject: Thank you for contacting Executive Speech Coaching NYC

Hi {{Name}},

Thank you for reaching out about {{Service Interest}}. I received your message and will respond personally within 24 hours.

In the meantime, here's what happens next:

1. I'll review your specific communication goals
2. Within 24 hours, you'll receive a personalized response
3. If you selected a Discovery Call, I'll send calendar booking options

For immediate questions, feel free to reply to this email.

Best regards,
Daniel Reece
Executive Speech Coach
```

**Email 2: Personal Follow-up (24 hours, if no response)**
```
Subject: Your Communication Goals - Let's Connect

Hi {{Name}},

I reviewed your message about {{Service Interest}} and your goals around {{Message excerpt}}.

Based on what you shared, I believe {{Personalized recommendation based on service interest}}.

I'd love to offer you a complimentary 15-minute Discovery Call to:
- Understand your specific challenges
- Share relevant strategies
- Determine if we're a good fit

{{Calendar booking link}}

What's the best time for you this week?

Best,
Daniel
```

### 4.2 Lead Score-Based Sequences

**Hot Leads (80+ score) - VIP Treatment**
- Immediate personal email (within 1 hour)
- Direct calendar booking link
- Phone follow-up offer
- Premium resource package

**Warm Leads (50-79 score) - Standard Process**  
- Personal email within 24 hours
- Discovery call invitation
- Relevant blog post or case study
- Follow-up sequence

**Cold Leads (<50 score) - Nurture Sequence**
- Auto-responder sequence
- Educational content series
- Long-term nurture campaign
- Quarterly check-ins

---

## Step 5: Testing & Quality Assurance

### 5.1 Test Scenarios
1. **High-Value Lead**: C-level, large company, immediate timeline
2. **Medium Lead**: Director, medium company, 3-month timeline  
3. **Low-Value Lead**: Individual contributor, no timeline specified
4. **Newsletter Signup**: Email-only subscription
5. **Mobile Submission**: Test responsive form behavior

### 5.2 Validation Checklist
- [ ] Form submits successfully
- [ ] Webhook triggers Zapier
- [ ] Lead scoring calculates correctly
- [ ] Airtable record creates properly
- [ ] Auto-responder email sends
- [ ] Priority-based routing works
- [ ] Follow-up dates set correctly
- [ ] Mobile comREDACTED_AIRTABLE_PAT confirmed

### 5.3 Error Handling
- **Failed webhook**: Set up email notification
- **Airtable connection issue**: Create backup to Google Sheets
- **Email delivery failure**: Log in separate table for manual follow-up

---

## Step 6: Monitoring & Optimization

### 6.1 Key Metrics to Track
- Form conversion rate
- Lead score distribution  
- Response time to hot leads
- Email open/click rates
- Discovery call booking rate
- Lead to client conversion

### 6.2 Monthly Review Process
1. Analyze lead sources and quality
2. Review scoring algorithm effectiveness
3. Optimize email templates based on responses
4. Update form fields based on insights
5. Refine automation based on feedback

### 6.3 Continuous Improvement
- A/B test email subject lines
- Experiment with form field combinations
- Adjust lead scoring based on actual conversions
- Optimize follow-up timing
- Add new automation triggers

---

## Estimated Costs

### Monthly Subscription Costs
- **Tally Pro**: $29/month (advanced features)
- **Zapier Professional**: $29.99/month (multi-step Zaps)
- **Airtable Plus**: $24/month (advanced features)
- **Total**: ~$83/month

### Implementation Time
- **Tally Form Setup**: 2-3 hours
- **Zapier Automation**: 3-4 hours
- **Airtable Configuration**: 2-3 hours  
- **Testing & Refinement**: 2-3 hours
- **Total**: 9-13 hours

### Expected ROI
- Automated lead capture: 24/7 availability
- Lead scoring: Focus on high-value prospects
- Instant follow-up: Improved conversion rates
- Professional image: Enhanced credibility
- Time savings: 10+ hours/week manual work eliminated

This integration creates a professional, automated lead capture system that rivals enterprise CRM solutions at a fraction of the cost.