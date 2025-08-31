# Zapier Webhook Setup Instructions

## Quick Setup (5 minutes)

### Step 1: Create Your Zapier Webhook

1. Go to [Zapier.com](https://zapier.com) and log in
2. Click "Create Zap" 
3. Search for and select **"Webhooks by Zapier"** as your trigger
4. Choose **"Catch Hook"** as the trigger event
5. Click Continue
6. Copy the webhook URL (looks like: `https://hooks.zapier.com/hooks/catch/REDACTED/REDACTED`)

### Step 2: Add Webhook to Your Website

1. Open `/static/js/automation-config.js`
2. Replace `'YOUR_WEBHOOK_URL_HERE'` with your webhook URL:
```javascript
window.ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/REDACTED/REDACTED';
```
3. Save the file

### Step 3: Test the Webhook

1. Go to your website's contact form
2. Submit a test contact form
3. Go back to Zapier and click "Test trigger"
4. You should see your test submission data

### Step 4: Complete the Automation

Now that the webhook is receiving data, set up these actions in Zapier:

#### Action 1: Create/Update Airtable Record
- **App**: Airtable
- **Action**: Create Record (or Find or Create Record)
- **Base**: ExecutiveSpeechCoachingNYC.com Client Management
- **Table**: Clients
- **Field Mapping**:
  - Client Name → `name` from webhook
  - Contact Details → `Email: {email}` from webhook
  - Personal Preferences → `Source: Website, Interest: {subject}, Message: {message}`

#### Action 2: Send Welcome Email
- **App**: Gmail
- **Action**: Send Email
- **To**: `email` from webhook
- **Subject**: Thank you for contacting Executive Speech Coaching NYC
- **Body**: Use the template from our automation docs

#### Action 3 (Optional): Send Telegram/SMS Notification
- **App**: Telegram or SMS by Zapier
- **Action**: Send Message
- **Message**: "New lead: {name} - {subject}"

### Step 5: Turn On Your Zap

1. Name your Zap: "Website Contact Form Automation"
2. Turn it ON
3. Test with another form submission to verify everything works

---

## What Happens Now?

When someone submits your contact form:

1. ✅ Form data goes to Zapier webhook
2. ✅ Zapier creates record in Airtable CRM
3. ✅ Automated welcome email sent via Gmail
4. ✅ You get notified (if configured)
5. ✅ FormSubmit still works as backup

---

## Troubleshooting

**Form not submitting?**
- Check browser console for errors (F12)
- Verify webhook URL is correct in `automation-config.js`

**Not seeing data in Zapier?**
- Make sure webhook URL is exactly as provided (no extra spaces)
- Test trigger in Zapier after submitting form

**Airtable not updating?**
- Verify field mappings in Zapier
- Check Airtable permissions

---

## Current Setup Status

✅ **Airtable CRM** - Already configured with tables
✅ **Gmail** - Connected (daniel@executivespeechcoachingnyc.com)
✅ **Form JavaScript** - Updated to send to webhook
⏳ **Webhook URL** - Needs to be added to `automation-config.js`
⏳ **Zapier Zap** - Needs to be created

---

## Next Steps

After webhook is working:
1. Add Calendly integration for booking
2. Connect Stripe for payments
3. Set up SMS reminders
4. Add Telegram notifications