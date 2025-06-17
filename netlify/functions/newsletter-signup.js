const Airtable = require('airtable');
const nodemailer = require('nodemailer');

// Helper function to validate email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to sanitize input
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
};

// Configure CORS headers
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json',
};

exports.handler = async (event, context) => {
  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    // Parse request body
    const data = JSON.parse(event.body);
    
    // Extract and sanitize form data
    const email = sanitizeInput(data.email);
    const firstName = sanitizeInput(data.firstName || '');
    const lastName = sanitizeInput(data.lastName || '');
    const interests = Array.isArray(data.interests) ? data.interests.map(sanitizeInput) : [];
    const referralSource = sanitizeInput(data.referralSource || 'Newsletter Signup Form');
    
    // Validation
    if (!email || !isValidEmail(email)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Valid email is required' }),
      };
    }
    
    // Initialize Airtable
    const airtableApiKey = process.env.AIRTABLE_API_KEY;
    const airtableBaseId = process.env.AIRTABLE_BASE_ID;
    
    if (!airtableApiKey || !airtableBaseId) {
      console.error('Missing Airtable configuration');
      throw new Error('Service configuration error');
    }
    
    const base = new Airtable({ apiKey: airtableApiKey }).base(airtableBaseId);
    
    // Check if email already exists in the Leads table
    const existingRecords = await base(process.env.AIRTABLE_LEADS_TABLE || 'Leads')
      .select({
        filterByFormula: `{Email} = '${email}'`,
        maxRecords: 1,
      })
      .firstPage();
    
    if (existingRecords.length > 0) {
      // Update existing record
      await base(process.env.AIRTABLE_LEADS_TABLE || 'Leads').update([
        {
          id: existingRecords[0].id,
          fields: {
            'Last Updated': new Date().toISOString(),
            'Interests': interests.join(', '),
            'Active': true,
          },
        },
      ]);
      
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'You are already subscribed! Your preferences have been updated.',
          existing: true,
        }),
      };
    }
    
    // Create new record in Airtable
    const airtableRecord = await base(process.env.AIRTABLE_LEADS_TABLE || 'Leads').create([
      {
        fields: {
          'Email': email,
          'First Name': firstName,
          'Last Name': lastName,
          'Source': referralSource,
          'Interests': interests.join(', '),
          'Subscribe Date': new Date().toISOString(),
          'Active': true,
          'Type': 'Newsletter Subscriber',
        },
      },
    ]);
    
    // Configure email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT),
      secure: process.env.SMTP_PORT === '465',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    
    // Send welcome email
    const welcomeEmail = `
      <h2>Welcome to Executive Speech Coaching NYC</h2>
      <p>Hi ${firstName || 'there'},</p>
      <p>Thank you for subscribing to our newsletter! You'll receive:</p>
      <ul>
        <li>Weekly communication tips and insights</li>
        <li>Exclusive resources for executive development</li>
        <li>Early access to workshops and special offers</li>
        <li>Success stories and case studies</li>
      </ul>
      <p>As a welcome gift, here's a link to our free guide: "5 Executive Communication Mistakes That Cost You Credibility"</p>
      <p>Stay tuned for valuable content coming your way!</p>
      <p>Best regards,<br>Daniel Reece<br>Executive Speech Coaching NYC</p>
      <hr>
      <p><small>You can unsubscribe at any time by clicking the link at the bottom of our emails.</small></p>
    `;
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Welcome to Executive Speech Coaching NYC Newsletter',
      html: welcomeEmail,
    });
    
    // Send notification to admin
    const adminNotification = `
      <h3>New Newsletter Signup</h3>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Name:</strong> ${firstName} ${lastName}</p>
      <p><strong>Interests:</strong> ${interests.join(', ') || 'None specified'}</p>
      <p><strong>Source:</strong> ${referralSource}</p>
      <p><small>Airtable ID: ${airtableRecord[0].id}</small></p>
    `;
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `New Newsletter Subscriber: ${email}`,
      html: adminNotification,
    });
    
    // Trigger n8n webhook if configured
    if (process.env.N8N_NEWSLETTER_WEBHOOK || process.env.N8N_CONTACT_WEBHOOK) {
      try {
        const webhookUrl = process.env.N8N_NEWSLETTER_WEBHOOK || process.env.N8N_CONTACT_WEBHOOK;
        const webhookData = {
          type: 'newsletter_signup',
          email,
          firstName,
          lastName,
          interests,
          airtableId: airtableRecord[0].id,
          timestamp: new Date().toISOString(),
        };
        
        // Add webhook token if configured
        if (process.env.N8N_WEBHOOK_TOKEN) {
          webhookData.token = process.env.N8N_WEBHOOK_TOKEN;
        }
        
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(webhookData),
        });
      } catch (webhookError) {
        // Log webhook error but don't fail the request
        console.error('n8n webhook error:', webhookError);
      }
    }
    
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Thank you for subscribing! Check your email for a welcome message.',
        recordId: airtableRecord[0].id,
      }),
    };
    
  } catch (error) {
    console.error('Newsletter signup error:', error);
    
    // Don't expose internal errors to the client
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'An error occurred processing your subscription. Please try again later.',
      }),
    };
  }
};