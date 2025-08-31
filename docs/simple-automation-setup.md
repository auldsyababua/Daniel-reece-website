# Ultra-Simple Coaching Automation Setup

## The Simplest Possible Stack ($52/month)

### Core Tools Only:
1. **Airtable** (Free → $20/month when ready) - Your simple CRM
2. **Zapier** ($20/month) - Connects everything  
3. **Calendly** ($12/month) - Booking with spam protection
4. **Stripe** (2.9% per payment) - Invoicing & payments
5. **Gmail** (Already have) - All your emails

That's it. No complex email marketing tools needed.

---

## Super Simple 3-Stage Pipeline

### Just Three Stages:
1. **Prospect** - Anyone who's shown interest
2. **Customer** - Currently paying for coaching
3. **Past Customer** - Finished their program

*That's it. Keep it simple.*

---

## Part 1: Airtable Setup (15 minutes)

### Create One Table: "Contacts"

```
Essential Fields Only:
- Name
- Email
- Phone
- Company
- Status (Prospect / Customer / Past Customer)
- Source (How they found you)
- Notes
- Next Action Date
```

### Create 3 Views:
1. **All Contacts** - Everyone in one place
2. **Current Customers** - Filter: Status = Customer
3. **Follow-ups** - Filter: Next Action = Today or Overdue

---

## Part 2: Gmail + Zapier Email Templates

### Instead of ConvertKit, just use Gmail templates:

**Template 1: Discovery Call Confirmation**
```
Subject: Confirmed: Your Discovery Call on [DATE]

Hi [NAME],

Your discovery call is confirmed for [DATE] at [TIME].

Zoom link: [LINK]

To prepare, think about:
- Your biggest speaking challenge
- An upcoming presentation or situation
- What success looks like for you

Looking forward to speaking with you!

Best,
Dan
```

**Template 2: Thank You After Discovery Call**
```
Subject: Thank you for our conversation

Hi [NAME],

Thank you for taking the time to discuss your communication goals today.

As discussed, here are the next steps:
[NEXT STEPS]

Let me know if you have any questions.

Best,
Dan
```

**Template 3: New Client Welcome**
```
Subject: Welcome! Let's get started

Hi [NAME],

Welcome to Executive Speech Coaching! 

Your first session is scheduled for [DATE].

Before then, you'll receive:
- Calendar invite with Zoom link
- Brief prep questionnaire
- Access to resource library

Excited to begin this journey with you!

Best,
Dan
```

---

## Part 3: Five Simple Zapier Automations

### Zap 1: Website Form → Airtable + Email
```
Trigger: Webhook from your form
Action 1: Create row in Airtable
Action 2: Gmail - Send email (Template: Thanks for reaching out)
```

### Zap 2: Calendly Booking → Airtable + Email
```
Trigger: New Calendly booking
Action 1: Find or create contact in Airtable
Action 2: Update status to "Prospect"
Action 3: Gmail - Send confirmation email
```

### Zap 3: Day Before Discovery Call Reminder
```
Trigger: Calendly - 24 hours before event
Action: Gmail - Send reminder email with prep questions
```

### Zap 4: Stripe Payment → Update Customer Status
```
Trigger: New Stripe payment
Action 1: Find contact in Airtable by email
Action 2: Update status to "Customer"
Action 3: Gmail - Send welcome email
```

### Zap 5: Weekly Follow-up Reminder
```
Trigger: Every Monday at 9am
Action: Gmail - Send you a summary of who needs follow-up
```

---

## Part 4: Calendly Setup (10 minutes)

### One Event Type: "Discovery Call"

**Basic Settings:**
- 30 minutes
- Available: Tue-Thu, 10am-4pm (or your preference)
- Buffer: 15 minutes between calls

**Spam Protection Questions (Required):**
1. "What's your biggest communication challenge?"
2. "What's your company/role?"
3. Phone number

**Confirmation Page:**
"Thank you! You'll receive a confirmation email shortly with prep questions."

---

## Part 5: Stripe Setup (20 minutes)

### Create 3 Products:
1. **Discovery Call** - $0 (if you charge for these)
2. **6-Session Package** - $3,000
3. **12-Session Package** - $5,500

### Create Payment Links:
- Go to Stripe Dashboard → Payment Links
- Create a link for each package
- Add these links to your website

### Turn on Invoicing:
- Stripe Dashboard → Invoicing → Enable
- Now you can send professional invoices with one click

---

## Implementation Checklist

### Day 1 (1 hour):
- [ ] Sign up for Airtable (start free)
- [ ] Create your simple Contacts table
- [ ] Import any existing contacts

### Day 2 (1 hour):
- [ ] Sign up for Calendly
- [ ] Create Discovery Call event type
- [ ] Add screening questions
- [ ] Test booking yourself

### Day 3 (2 hours):
- [ ] Sign up for Zapier
- [ ] Create Zap 1: Form → Airtable
- [ ] Create Zap 2: Calendly → Airtable
- [ ] Test both with real bookings

### Day 4 (1 hour):
- [ ] Set up Stripe products
- [ ] Create payment links
- [ ] Create Zap 4: Payment → Customer

### Day 5 (30 minutes):
- [ ] Write your 3 Gmail templates
- [ ] Save as templates in Gmail
- [ ] Test sending them via Zapier

---

## Daily Workflow (After Setup)

### Morning (5 minutes):
1. Check Airtable "Follow-ups" view
2. See who needs contact today
3. Send personal emails

### When Someone Books:
- Automatically added to Airtable ✓
- Automatically sent confirmation ✓
- You just show up for the call

### After Discovery Call (2 minutes):
1. Update their Airtable notes
2. Send invoice via Stripe if moving forward
3. Set follow-up date

### When Payment Received:
- Status automatically updates to Customer ✓
- Welcome email sent automatically ✓
- You schedule first session

---

## Even Simpler Option: Start with Just Calendly

If this still feels like too much, start with JUST:

1. **Calendly** ($12/month)
2. **Google Calendar** (free)
3. **Stripe** (for payments)

This gives you:
- Automated booking
- Automatic reminders
- Professional invoicing

Add Airtable and Zapier later when you're ready.

---

## What This Eliminates:

✓ Back-and-forth scheduling emails
✓ Manual reminder sending  
✓ Tracking who needs follow-up
✓ Creating invoices from scratch
✓ Updating spreadsheets
✓ Losing track of prospects

**Time saved: 8-10 hours per week**
**Cost: $52/month**

---

## Upgrade Path (When Ready):

### Month 2-3:
- Add more Airtable fields
- Create more email templates
- Add post-session automations

### Month 4-6:
- Add email marketing tool (MailerLite free)
- Create nurture sequences
- Add testimonial automation

### Month 7-12:
- Add chat to website
- Implement SMS reminders
- Build client portal

---

## The Key: Start Simple

Don't try to automate everything at once. Get these basics working first:

1. **Automated booking** (Calendly)
2. **Simple CRM** (Airtable)
3. **Basic email automation** (Gmail + Zapier)

That alone will transform your business.

Remember: **Simple and working beats complex and broken every time.**

Ready to start? Begin with Day 1 checklist above!