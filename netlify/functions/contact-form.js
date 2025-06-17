const Airtable = require('airtable');
const nodemailer = require('nodemailer');

// Helper function to validate email
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to validate phone
const isValidPhone = (phone) => {
  // Allow various phone formats, but at least 10 digits
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  const digitsOnly = phone.replace(/\D/g, '');
  return phoneRegex.test(phone) && digitsOnly.length >= 10;
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
    const name = sanitizeInput(data.name);
    const email = sanitizeInput(data.email);
    const phone = sanitizeInput(data.phone);
    const company = sanitizeInput(data.company || '');
    const message = sanitizeInput(data.message);
    const serviceInterest = sanitizeInput(data.serviceInterest || '');
    const referralSource = sanitizeInput(data.referralSource || 'Website Contact Form');
    
    // Validation
    const errors = [];
    
    if (!name || name.length < 2) {
      errors.push('Name is required and must be at least 2 characters');
    }
    
    if (!email || !isValidEmail(email)) {
      errors.push('Valid email is required');
    }
    
    if (phone && !isValidPhone(phone)) {
      errors.push('Phone number format is invalid');
    }
    
    if (!message || message.length < 10) {
      errors.push('Message is required and must be at least 10 characters');
    }
    
    if (errors.length > 0) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Validation failed', details: errors }),
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
    
    // Create record in Airtable
    const airtableRecord = await base(process.env.AIRTABLE_CLIENTS_TABLE || 'Clients').create([
      {
        fields: {
          'Name': name,
          'Email': email,
          'Phone': phone || '',
          'Company': company,
          'Source': referralSource,
          'Service Interest': serviceInterest,
          'Stage': 'New Lead',
          'Notes': message,
          'Contact Date': new Date().toISOString(),
          'Follow-up Required': true,
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
    
    // Email content
    const emailContent = `
      <h2>New Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
      <p><strong>Company:</strong> ${company || 'Not provided'}</p>
      <p><strong>Service Interest:</strong> ${serviceInterest || 'Not specified'}</p>
      <p><strong>Message:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p><small>This lead has been automatically added to Airtable (ID: ${airtableRecord[0].id})</small></p>
    `;
    
    // Send notification email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: process.env.ADMIN_EMAIL,
      subject: `New Contact: ${name} - ${serviceInterest || 'General Inquiry'}`,
      html: emailContent,
    });
    
    // Send confirmation email to the user
    const confirmationEmail = `
      <h2>Thank you for contacting Executive Speech Coaching NYC</h2>
      <p>Dear ${name},</p>
      <p>Thank you for reaching out to us. We've received your message and will get back to you within 24 hours.</p>
      <p>In the meantime, feel free to explore our services or book a free discovery call directly through our website.</p>
      <p>Best regards,<br>Daniel Reece<br>Executive Speech Coaching NYC</p>
    `;
    
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: 'Thank you for contacting Executive Speech Coaching NYC',
      html: confirmationEmail,
    });
    
    // Trigger n8n webhook if configured
    if (process.env.N8N_CONTACT_WEBHOOK) {
      try {
        const webhookData = {
          name,
          email,
          phone,
          company,
          message,
          serviceInterest,
          airtableId: airtableRecord[0].id,
          timestamp: new Date().toISOString(),
        };
        
        // Add webhook token if configured
        if (process.env.N8N_WEBHOOK_TOKEN) {
          webhookData.token = process.env.N8N_WEBHOOK_TOKEN;
        }
        
        await fetch(process.env.N8N_CONTACT_WEBHOOK, {
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
        message: 'Thank you for your message. We will get back to you soon!',
        recordId: airtableRecord[0].id,
      }),
    };
    
  } catch (error) {
    console.error('Contact form error:', error);
    
    // Don't expose internal errors to the client
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'An error occurred processing your request. Please try again later.',
      }),
    };
  }
};