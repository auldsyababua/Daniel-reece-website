# Executive Speech Coaching - Airtable Base Structure

## Base Name: "Executive Speech Coaching Leads"

### Table 1: "Leads" (Main Table)

**Core Contact Information**
- **Name** (Single line text) - Full name from contact form
- **Email** (Email) - Primary contact email
- **Phone** (Phone number) - Optional phone number
- **Company** (Single line text) - Company/organization name
- **Title** (Single line text) - Job title/position
- **LinkedIn** (URL) - LinkedIn profile URL (optional)

**Lead Details**
- **Service Interest** (Single select)
  - Discovery Call
  - 1:1 Executive Speech Coaching
  - Executive Training Programs
  - Group Communication Training
  - General Inquiry
  - Other
- **Message** (Long text) - Full message from contact form
- **Lead Source** (Single select)
  - Website Contact Form
  - Newsletter Signup
  - Referral
  - Social Media
  - Speaking Event
  - Other
- **Submission Date** (Date & time) - When form was submitted

**Lead Scoring & Qualification**
- **Lead Score** (Number) - Calculated score (0-100)
- **Priority Level** (Single select)
  - Hot (80-100 points)
  - Warm (50-79 points)  
  - Cold (0-49 points)
- **Company Size** (Single select)
  - Enterprise (500+ employees) - 30 points
  - Large (100-499 employees) - 20 points
  - Medium (50-99 employees) - 15 points
  - Small (10-49 employees) - 10 points
  - Startup (<10 employees) - 5 points
- **Seniority Level** (Single select)
  - C-Level (CEO, CFO, etc.) - 40 points
  - VP/SVP - 30 points
  - Director - 20 points
  - Manager - 15 points
  - Individual Contributor - 10 points
  - Other - 5 points
- **Budget Indicators** (Multiple select)
  - Mentioned budget - 20 points
  - Urgent timeline - 15 points
  - Previous coaching experience - 10 points
  - Team training needs - 15 points
  - Board presentation prep - 25 points

**Status Tracking**
- **Lead Status** (Single select)
  - New
  - Contacted
  - Qualified
  - Discovery Call Scheduled
  - Proposal Sent
  - Client
  - Lost
  - Unqualified
- **Follow-up Date** (Date) - Next scheduled follow-up
- **Last Contact** (Date) - Date of last interaction
- **Notes** (Long text) - Internal notes and conversation history

**Communication Tracking**
- **Email Responses** (Link to Table: "Email History")
- **Meetings** (Link to Table: "Meetings")
- **Proposals** (Link to Table: "Proposals")

---

### Table 2: "Email History"

**Email Details**
- **Lead** (Link to Table: "Leads") - Connected lead
- **Subject** (Single line text) - Email subject line
- **Type** (Single select)
  - Initial Response
  - Follow-up
  - Discovery Call Invite
  - Proposal
  - Check-in
  - Other
- **Sent Date** (Date & time) - When email was sent
- **Response Received** (Checkbox) - Did they respond?
- **Response Date** (Date & time) - When they responded
- **Email Content** (Long text) - Email content/notes
- **Next Action** (Single line text) - What's the next step?

---

### Table 3: "Meetings"

**Meeting Details**
- **Lead** (Link to Table: "Leads") - Connected lead
- **Meeting Type** (Single select)
  - Discovery Call
  - Strategy Session
  - Proposal Meeting
  - Follow-up Call
  - Other
- **Meeting Date** (Date & time) - Scheduled meeting time
- **Duration** (Number) - Meeting length in minutes
- **Status** (Single select)
  - Scheduled
  - Completed
  - Cancelled
  - No-show
- **Meeting Notes** (Long text) - Notes from the meeting
- **Outcome** (Single select)
  - Qualified - Moving Forward
  - Not Qualified
  - Needs More Information
  - Proposal Requested
  - Client Signed
- **Next Steps** (Long text) - Action items and next steps

---

### Table 4: "Proposals"

**Proposal Details**
- **Lead** (Link to Table: "Leads") - Connected lead
- **Proposal Type** (Single select)
  - 1:1 Coaching Package
  - Executive Training Program
  - Group Training
  - Custom Program
- **Proposal Date** (Date) - When proposal was sent
- **Value** (Currency) - Proposal value
- **Status** (Single select)
  - Draft
  - Sent
  - Under Review
  - Accepted
  - Declined
  - Expired
- **Valid Until** (Date) - Proposal expiration date
- **Proposal Link** (URL) - Link to proposal document
- **Notes** (Long text) - Proposal-specific notes

---

### Table 5: "Newsletter Subscribers"

**Subscriber Details**
- **Email** (Email) - Subscriber email
- **Name** (Single line text) - Name (if collected)
- **Subscription Date** (Date & time) - When they subscribed
- **Status** (Single select)
  - Active
  - Unsubscribed
  - Bounced
- **Source** (Single select)
  - Website Footer
  - Blog Post
  - Contact Form
  - Speaking Event
  - Referral
- **Lead Record** (Link to Table: "Leads") - If they became a lead

---

## Automation Rules

### Lead Scoring Formula
```
Base Score = 0
+ Company Size Points (5-30)
+ Seniority Level Points (5-40) 
+ Budget Indicators Points (0-35)
+ Service Interest Bonus:
  - Executive Training Programs: +10
  - 1:1 Coaching: +5
  - Discovery Call: +15 (high intent)

Priority Level:
- 80-100: Hot Lead
- 50-79: Warm Lead  
- 0-49: Cold Lead
```

### Auto-Assignments
- **Hot Leads (80+ score)**: Immediate notification, same-day follow-up
- **Warm Leads (50-79)**: Follow-up within 24 hours
- **Cold Leads (<50)**: Add to nurture sequence, follow-up within 3 days

### Follow-up Automation
- **Day 0**: Immediate auto-response email
- **Day 1**: Personal follow-up email (if no response)
- **Day 3**: Value-add email with relevant blog post
- **Day 7**: Discovery call invitation
- **Day 14**: Case study or testimonial
- **Day 30**: Last attempt with special offer

---

## Integration Points

### Zapier Triggers
1. **New Form Submission** → Create Lead Record
2. **Lead Score Calculation** → Update Priority Level
3. **High-Value Lead** → Send Slack notification
4. **Newsletter Signup** → Add to Newsletter table

### Email Integration
- Auto-responder sequences based on lead score
- CRM integration for email tracking
- Calendar booking links in emails

### Reporting Views
- **Hot Leads Dashboard**: All leads 80+ score
- **Follow-up Queue**: Leads needing contact today
- **Pipeline View**: Leads by status
- **Monthly Report**: Conversion metrics
- **ROI Analysis**: Value per lead source

This structure provides comprehensive lead management while maintaining the professional standards expected by executive clients.