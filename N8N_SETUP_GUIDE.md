# n8n Workflow Setup Guide

## Your n8n Instance
- **URL**: https://n8n-rrrs.sliplane.app
- **Email**: daniel@executivespeechcoachingnyc.com

---

## Step 1: Create New Workflow

1. **Log into n8n**: https://n8n-rrrs.sliplane.app
2. Click **"New Workflow"** button
3. Name it: **"Contact Form Automation"**

---

## Step 2: Add Webhook Trigger

1. **Add Node**: Click "+" → Search "Webhook" → Select **Webhook**
2. **Configure**:
   - **HTTP Method**: POST
   - **Path**: `contact-form`
   - **Response Code**: 200
   - **Response Mode**: "On Received"
   - **Response Data**: "First Entry JSON"

3. **Save and Copy URL**: 
   - Click "Listen for Test Event"
   - Copy the webhook URL (will be like: `https://n8n-rrrs.sliplane.app/webhook/contact-form`)

---

## Step 3: Test Webhook

Run this command to test:
```bash
curl -X POST "YOUR_WEBHOOK_URL_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "subject": "Executive Presence Coaching",
    "message": "I need help with presentation skills",
    "source": "Website Contact Form",
    "timestamp": "2025-08-07T12:00:00Z"
  }'
```

You should see the data appear in n8n!

---

## Step 4: Add Airtable Node

1. **Add Node**: Click "+" after Webhook → Search "Airtable" → Select **Airtable**
2. **Create Credentials**:
   - Click "Create New"
   - **API Key**: Get from Airtable (Account → Developer Hub → Personal Access Tokens)
   - Name it: "Airtable - Executive Coaching"

3. **Configure Node**:
   - **Resource**: Record
   - **Operation**: Create
   - **Base ID**: `appXk9QepZD7Riwyl`
   - **Table**: Select "Leads" from dropdown

4. **Map Fields**: Click "Add Field" for each:
   
   **Name** → Expression: `{{$json["name"]}}`
   
   **Email** → Expression: `{{$json["email"]}}`
   
   **Service Interest** → Expression: `{{$json["subject"]}}`
   
   **Message** → Expression: `{{$json["message"]}}`
   
   **Lead Source** → Fixed: "Website Contact Form"
   
   **Submission Date** → Expression: `{{$json["timestamp"]}}`
   
   **Lead Status** → Fixed: "New"

---

## Step 5: Add Gmail Node

1. **Add Node**: Click "+" after Airtable → Search "Gmail" → Select **Gmail**
2. **Create Credentials**:
   - Click "Create New" → OAuth2
   - Follow Google OAuth flow
   - Use: daniel@executivespeechcoachingnyc.com

3. **Configure Node**:
   - **Resource**: Message
   - **Operation**: Send
   - **To**: Expression: `{{$node["Webhook"].json["email"]}}`
   - **Subject**: "Thank you for contacting Executive Speech Coaching NYC"
   - **Email Type**: HTML
   - **Message**: 
   ```html
   <div style='font-family: Arial, sans-serif; max-width: 600px;'>
     <h2 style='color: #1e40af;'>Hello {{$node["Webhook"].json["name"]}},</h2>
     
     <p>Thank you for reaching out about <strong>{{$node["Webhook"].json["subject"]}}</strong>. 
     I've received your message and will respond within 24 hours.</p>
     
     <p>In the meantime, feel free to 
     <a href='https://calendly.com/executivespeechcoachingnyc'>book a consultation</a> directly.</p>
     
     <p>Best regards,<br>
     Daniel Reece<br>
     Executive Speech Coach</p>
   </div>
   ```

---

## Step 6: Activate Workflow

1. **Test Complete Flow**: Click "Execute Workflow" with test data
2. **Activate**: Toggle the workflow to "Active" (top right)
3. **Get Production URL**: 
   - Click on Webhook node
   - Switch to "Production" tab
   - Copy the production webhook URL

---

## Step 7: Update Your Website

Update `/static/js/automation-config.js`:
```javascript
// Replace Zapier webhook with n8n webhook
window.ZAPIER_WEBHOOK_URL = 'https://n8n-rrrs.sliplane.app/webhook/contact-form';
```

---

## Testing the Complete Flow

1. **Submit a test form** on your website
2. **Check n8n**: Go to "Executions" to see the workflow run
3. **Verify Airtable**: New lead should appear
4. **Check Gmail**: Welcome email should be sent

---

## Troubleshooting

### Webhook not receiving data:
- Check webhook URL is correct
- Ensure workflow is "Active"
- Check browser console for errors

### Airtable not updating:
- Verify API key permissions
- Check field name mappings
- Ensure table name is "Leads"

### Gmail not sending:
- Re-authenticate OAuth
- Check email field mapping
- Verify recipient email is valid

---

## Optional Enhancements

### Add SMS Notification
1. Add **Twilio** node after Airtable
2. Send yourself SMS for new leads

### Add Slack Alert
1. Add **Slack** node
2. Post to #leads channel

### Add Error Handling
1. Add **Error Trigger** node
2. Send alert if workflow fails

---

## Webhook URL Format

Your final webhook URL will be:
```
https://n8n-rrrs.sliplane.app/webhook/contact-form
```

This replaces the Zapier webhook completely!