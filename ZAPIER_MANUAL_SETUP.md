# Zapier Manual Setup Guide

## ⚠️ MCP OAuth Issue Workaround

The "No service like that" error is a known issue with Zapier MCP OAuth authentication. This guide provides a manual setup that bypasses the MCP and creates the automation directly in Zapier.

---

## Step 1: Create the Webhook Trigger

1. **Go to Zapier.com** and click "Create Zap"
2. **Search for "Webhooks by Zapier"** as your trigger app
3. **Select "Catch Hook"** as the trigger event
4. Click **Continue**
5. **Copy the webhook URL** that appears (looks like: `https://hooks.zapier.com/hooks/catch/REDACTED/REDACTED`)
6. **Save this URL** - you'll need it for your website

### Add Webhook to Your Website:
```javascript
// In /static/js/automation-config.js
window.ZAPIER_WEBHOOK_URL = 'YOUR_WEBHOOK_URL_HERE';
```

---

## Step 2: Test the Webhook

1. **Open a new browser tab** and go to your website's contact form
2. **Submit a test form** with this data:
   - Name: Test User
   - Email: test@example.com
   - Subject: Executive Presence Coaching
   - Message: Testing the automation setup

3. **Go back to Zapier** and click "Test trigger"
4. You should see your test data appear
5. Click **Continue with selected record**

---

## Step 3: Set Up Airtable Integration

### Find or Create Record Action:

1. **Choose App**: Airtable
2. **Choose Event**: Find or Create Record
3. **Connect your Airtable account** (use daniel@executivespeechcoachingnyc.com)
4. **Configure the action**:

   **Base** → ExecutiveSpeechCoachingNYC.com Client Management
   
   **Table** → Clients
   
   **Search By Field** → Email
   
   **Search Value** → Use data from Step 1: `email`
   
   **Create if not found?** → Yes

5. **Set up field mappings** for new records:

   **Client Name** → Insert data from Step 1: `name`
   
   **Email** → Insert data from Step 1: `email`
   
   **Lead Source** → Type: "Website Contact Form"
   
   **Pipeline Stage** → Type: "Prospect"
   
   **First Contact Date** → Insert data from Step 1: `timestamp`
   
   **Initial Message** → Build text with Step 1 data:
   ```
   Subject: {{subject}}
   Message: {{message}}
   ```
   
   **Status** → Type: "Active"

6. **Test this action** and verify it creates/finds a record in Airtable

---

## Step 4: Set Up Gmail Welcome Email

1. **Add another action** (+)
2. **Choose App**: Gmail
3. **Choose Event**: Send Email
4. **Connect your Gmail** (daniel@executivespeechcoachingnyc.com)
5. **Configure the email**:

   **To** → Insert data from Step 1: `email`
   
   **From Name** → Daniel Reece
   
   **Subject** → Thank you for contacting Executive Speech Coaching NYC
   
   **Body Type** → HTML
   
   **Body** → Use this template:
   ```html
   <div style='font-family: Arial, sans-serif; max-width: 600px;'>
     <h2>Hello {{1. Name}},</h2>
     
     <p>Thank you for reaching out about {{1. Subject}}. 
     I've received your message and will respond within 24 hours.</p>
     
     <p>In the meantime, feel free to 
     <a href='https://calendly.com/executivespeechcoachingnyc'>
     book a consultation</a> directly.</p>
     
     <p>Best regards,<br>
     Daniel Reece<br>
     Executive Speech Coach</p>
   </div>
   ```
   
   **BCC** → daniel@executivespeechcoachingnyc.com

6. **Test this action**

---

## Step 5: Log Interaction in Airtable

1. **Add another action** (+)
2. **Choose App**: Airtable
3. **Choose Event**: Create Record
4. **Use same account**
5. **Configure**:

   **Base** → ExecutiveSpeechCoachingNYC.com Client Management
   
   **Table** → Interactions
   
   **Field Mappings**:
   - **Client** → Use ID from Step 2 (Airtable Find/Create)
   - **Date** → Insert from Step 1: `timestamp`
   - **Type** → "Inbound Contact"
   - **Channel** → "Website Form"
   - **Notes** → Combine Step 1 data
   - **Follow-up Required** → True

6. **Test this action**

---

## Step 6: Optional Notifications

### SMS Notification (Optional):
1. **Add action**: SMS by Zapier
2. **Configure** your phone number
3. **Message**: "New lead: {{name}} - {{subject}}"

### Telegram Notification (Optional):
1. **Add action**: Telegram
2. **Connect** your Telegram bot
3. **Send message** with lead details

---

## Step 7: Name and Activate

1. **Name your Zap**: "Website Contact Form → Airtable + Gmail"
2. **Turn ON your Zap**
3. **Test with a real form submission**

---

## Verification Checklist

✅ Webhook URL added to `/static/js/automation-config.js`
✅ Test form submission appears in Zapier
✅ Airtable creates/updates client record
✅ Welcome email sends successfully
✅ Interaction logged in Airtable
✅ Notifications working (if configured)

---

## Troubleshooting

### Form data not reaching Zapier:
- Check browser console (F12) for errors
- Verify webhook URL is correct
- Ensure no extra spaces in URL

### Airtable not updating:
- Check field name mappings
- Verify Airtable permissions
- Ensure base ID is correct (appXk9QepZD7Riwyl)

### Gmail not sending:
- Check Gmail is connected
- Verify email addresses are valid
- Check spam folder for test emails

---

## Next Steps

After this is working:
1. Add Calendly booking automation
2. Set up Stripe payment triggers
3. Configure follow-up sequences
4. Add more sophisticated routing based on subject/interest

---

## Support

The MCP OAuth issue appears to be on Zapier's end. For now, this manual setup achieves the same result. The automation will:
- Capture all form submissions
- Create/update CRM records
- Send automated responses
- Log all interactions
- Notify you of new leads