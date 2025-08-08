// Automation Configuration
// This file configures the automation webhooks for your contact forms

// IMPORTANT: To connect your form to Zapier automation:
// 1. Go to Zapier.com and create a new Zap
// 2. Choose "Webhooks by Zapier" as the trigger
// 3. Select "Catch Hook" as the trigger event  
// 4. Copy the webhook URL provided
// 5. Paste it below replacing 'YOUR_WEBHOOK_URL_HERE'

// n8n Webhook URL for contact form automation (replaced Zapier!)
// Re-enabled for testing - webhook registration issue identified but working around it
window.ZAPIER_WEBHOOK_URL = 'https://n8n-rrrs.sliplane.app/webhook/contact-form'; // n8n webhook - testing!

// Example webhook URL format:
// window.ZAPIER_WEBHOOK_URL = 'https://hooks.zapier.com/hooks/catch/REDACTED/REDACTED';

// Once configured, form submissions will:
// 1. Create a new client record in Airtable
// 2. Send an automated welcome email via Gmail
// 3. Trigger any other automations you set up in Zapier

// Test mode - set to true to see console logs of form data
window.DEBUG_FORMS = true;