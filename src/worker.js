/**
 * Contact Form Handler - Cloudflare Worker
 * Handles form submissions for Executive Speech Coaching NYC
 */

// CORS headers for preflight requests
const corsHeaders = {
  'Access-Control-Allow-Origin': 'https://executivespeechcoachingnyc.com',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // Handle CORS preflight requests
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 200,
        headers: corsHeaders,
      });
    }

    // Only handle POST requests to /submit
    if (request.method !== 'POST' || url.pathname !== '/submit') {
      return new Response('Not Found', { status: 404 });
    }

    try {
      // Parse form data
      const formData = await request.formData();
      const submission = {
        // Required fields
        name: formData.get('name')?.toString().trim(),
        email: formData.get('email')?.toString().trim(),
        message: formData.get('message')?.toString().trim(),
        
        // Optional fields
        phone: formData.get('phone')?.toString().trim() || null,
        company: formData.get('company')?.toString().trim() || null,
        role: formData.get('role')?.toString().trim() || null,
        timeline: formData.get('timeline')?.toString().trim() || null,
        
        // Metadata
        submitted_at: new Date().toISOString(),
        user_agent: request.headers.get('User-Agent'),
        ip_address: request.headers.get('CF-Connecting-IP'),
        country: request.headers.get('CF-IPCountry'),
      };

      // Validate required fields
      const errors = validateSubmission(submission);
      if (errors.length > 0) {
        return new Response(JSON.stringify({ 
          success: false, 
          errors: errors 
        }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      }

      // Save to D1 database
      const savedSubmission = await saveSubmission(env.DB, submission);

      // Send notification email (if configured)
      if (env.RESEND_API_KEY) {
        await sendNotificationEmail(env, savedSubmission);
      }

      // Return success response
      return new Response(JSON.stringify({ 
        success: true,
        message: 'Thank you for your message. We will get back to you soon!',
        id: savedSubmission.id
      }), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });

    } catch (error) {
      console.error('Form submission error:', error);
      
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'An error occurred. Please try again.' 
      }), {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
          ...corsHeaders,
        },
      });
    }
  },
};

/**
 * Validate form submission
 */
function validateSubmission(submission) {
  const errors = [];

  if (!submission.name || submission.name.length < 2) {
    errors.push('Name is required and must be at least 2 characters');
  }

  if (!submission.email || !isValidEmail(submission.email)) {
    errors.push('Valid email address is required');
  }

  if (!submission.message || submission.message.length < 10) {
    errors.push('Message is required and must be at least 10 characters');
  }

  // Validate optional phone if provided
  if (submission.phone && !isValidPhone(submission.phone)) {
    errors.push('Phone number format is invalid');
  }

  return errors;
}

/**
 * Email validation
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Phone validation (flexible format)
 */
function isValidPhone(phone) {
  const phoneRegex = /^[\+]?[\d\s\-\(\)\.]{10,}$/;
  return phoneRegex.test(phone);
}

/**
 * Save submission to D1 database
 */
async function saveSubmission(db, submission) {
  const stmt = db.prepare(`
    INSERT INTO contact_submissions 
    (name, email, message, phone, company, role, timeline, submitted_at, user_agent, ip_address, country)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    RETURNING *
  `);

  const result = await stmt.bind(
    submission.name,
    submission.email,
    submission.message,
    submission.phone,
    submission.company,
    submission.role,
    submission.timeline,
    submission.submitted_at,
    submission.user_agent,
    submission.ip_address,
    submission.country
  ).first();

  return result;
}

/**
 * Send notification email via Resend
 */
async function sendNotificationEmail(env, submission) {
  const emailData = {
    from: 'noreply@executivespeechcoachingnyc.com',
    to: 'Daniel@executivespeechcoachingnyc.com',
    subject: `New Contact Form Submission - ${submission.name}`,
    html: `
      <h2>New Contact Form Submission</h2>
      
      <h3>Contact Information</h3>
      <p><strong>Name:</strong> ${submission.name}</p>
      <p><strong>Email:</strong> ${submission.email}</p>
      ${submission.phone ? `<p><strong>Phone:</strong> ${submission.phone}</p>` : ''}
      ${submission.company ? `<p><strong>Company:</strong> ${submission.company}</p>` : ''}
      ${submission.role ? `<p><strong>Role:</strong> ${submission.role}</p>` : ''}
      ${submission.timeline ? `<p><strong>Timeline:</strong> ${submission.timeline}</p>` : ''}
      
      <h3>Message</h3>
      <p>${submission.message.replace(/\n/g, '<br>')}</p>
      
      <h3>Submission Details</h3>
      <p><strong>Submitted:</strong> ${new Date(submission.submitted_at).toLocaleString()}</p>
      <p><strong>IP Address:</strong> ${submission.ip_address}</p>
      <p><strong>Country:</strong> ${submission.country}</p>
      
      <hr>
      <p><em>Respond directly to this email or call ${submission.phone ? `${submission.name} at ${submission.phone}` : 'via the provided email address'}.</em></p>
    `,
  };

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(emailData),
  });

  if (!response.ok) {
    console.error('Failed to send notification email:', await response.text());
  }

  return response;
}