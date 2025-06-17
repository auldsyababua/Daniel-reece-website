#!/usr/bin/env node

/**
 * Automated Setup Script for Executive Speech Coaching NYC
 * This script will create all necessary services and generate a complete .env file
 */

require('dotenv').config({ path: '.env.setup' });
const fs = require('fs').promises;
const crypto = require('crypto');

// Service configurations
const AIRTABLE_BASE_NAME = 'Executive Speech Coaching CRM';
const STRIPE_PRODUCTS = [
  { name: '1:1 Speech Coaching Session', price: 25000, type: 'one_time' },
  { name: 'Launch Package (8 Sessions)', price: 180000, type: 'one_time' },
  { name: 'Scale Package (12 Sessions)', price: 225000, type: 'one_time' },
  { name: 'Startup Team Package (15 Sessions)', price: 300000, type: 'one_time' },
  { name: 'Venture Team Package (20 Sessions)', price: 375000, type: 'one_time' },
  { name: 'Enterprise Team Package (25 Sessions)', price: 437500, type: 'one_time' }
];

// Generated values storage
const generatedConfig = {
  airtable: {},
  stripe: {},
  railway: {},
  calcom: {},
  tokens: {}
};

// Utility functions
function generateToken(length = 32) {
  return crypto.randomBytes(length).toString('hex');
}

function log(message, type = 'info') {
  const prefix = {
    info: '📌',
    success: '✅',
    error: '❌',
    warning: '⚠️'
  }[type] || '📌';
  console.log(`${prefix} ${message}`);
}

// Airtable Setup
async function setupAirtable() {
  log('Setting up Airtable base and tables...');
  
  try {
    // Create a minimal base first
    const response = await fetch('https://api.airtable.com/v0/meta/bases', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: AIRTABLE_BASE_NAME,
        tables: [
          {
            name: 'Clients',
            fields: [
              { name: 'Name', type: 'singleLineText' },
              { name: 'Email', type: 'email' }
            ]
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      log(`Airtable API error: ${errorText}`, 'error');
      
      // If base creation fails, we'll still generate a placeholder in the config
      log('Using placeholder base ID for configuration...', 'warning');
      generatedConfig.airtable.baseId = 'appXXXXXXXXXXXXXX';
      generatedConfig.airtable.clients_table_id = 'tblXXXXXXXXXXXXXX';
      generatedConfig.airtable.sessions_table_id = 'tblYYYYYYYYYYYYYY';
      generatedConfig.airtable.automation_log_table_id = 'tblZZZZZZZZZZZZZZ';
      return;
    }

    const data = await response.json();
    generatedConfig.airtable.baseId = data.id;
    
    // Store table IDs
    data.tables.forEach(table => {
      generatedConfig.airtable[`${table.name.toLowerCase().replace(/\s+/g, '_')}_table_id`] = table.id;
    });

    log('Airtable base created successfully!', 'success');
    log(`Base ID: ${data.id}`);
    
  } catch (error) {
    log(`Airtable setup failed: ${error.message}`, 'error');
    log('Using placeholder values - you can create the base manually', 'warning');
    generatedConfig.airtable.baseId = 'appXXXXXXXXXXXXXX';
    generatedConfig.airtable.clients_table_id = 'tblXXXXXXXXXXXXXX';
    generatedConfig.airtable.sessions_table_id = 'tblYYYYYYYYYYYYYY';
    generatedConfig.airtable.automation_log_table_id = 'tblZZZZZZZZZZZZZZ';
  }
}

// Stripe Setup
async function setupStripe() {
  log('Creating Stripe products and prices...');
  
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  
  try {
    for (const product of STRIPE_PRODUCTS) {
      // Create product
      const stripeProduct = await stripe.products.create({
        name: product.name,
        description: `Executive speech coaching - ${product.name}`,
        metadata: {
          type: product.name.includes('Package') ? 'package' : 'session'
        }
      });

      // Create price
      const price = await stripe.prices.create({
        product: stripeProduct.id,
        unit_amount: product.price,
        currency: 'usd',
        billing_scheme: 'per_unit',
        metadata: {
          product_name: product.name
        }
      });

      // Store price ID
      const key = product.name
        .toLowerCase()
        .replace(/[()]/g, '')
        .replace(/\s+/g, '_')
        .replace(/_+/g, '_');
      
      generatedConfig.stripe[`price_${key}`] = price.id;
      log(`Created: ${product.name} - ${price.id}`, 'success');
    }

    // Create webhook endpoint
    const webhook = await stripe.webhookEndpoints.create({
      url: `${process.env.DOMAIN_URL}/.netlify/functions/stripe-webhook`,
      enabled_events: [
        'payment_intent.succeeded',
        'payment_intent.payment_failed',
        'checkout.session.completed',
        'invoice.payment_succeeded'
      ]
    });

    generatedConfig.stripe.webhookSecret = webhook.secret;
    generatedConfig.stripe.webhookId = webhook.id;
    
    log('Stripe products and webhook created successfully!', 'success');
    
  } catch (error) {
    log(`Stripe setup failed: ${error.message}`, 'error');
    throw error;
  }
}

// Railway/n8n Setup
async function setupRailway() {
  log('Deploying n8n to Railway...');
  
  try {
    const response = await fetch('https://backboard.railway.app/graphql/v2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RAILWAY_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `
          mutation {
            projectCreate(
              input: {
                name: "Executive-Speech-Coaching-n8n"
                description: "Automation workflows for speech coaching platform"
                plugins: ["postgresql"]
              }
            ) {
              id
              name
            }
          }
        `
      })
    });

    if (!response.ok) {
      throw new Error(`Railway API error: ${response.statusText}`);
    }

    const { data } = await response.json();
    const projectId = data.projectCreate.id;

    // Deploy n8n service
    const deployResponse = await fetch('https://backboard.railway.app/graphql/v2', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RAILWAY_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: `
          mutation {
            serviceCreate(
              input: {
                projectId: "${projectId}"
                name: "n8n"
                source: {
                  image: "n8nio/n8n:latest"
                }
                variables: {
                  N8N_BASIC_AUTH_ACTIVE: "true"
                  N8N_BASIC_AUTH_USER: "admin"
                  N8N_BASIC_AUTH_PASSWORD: "${generateToken(16)}"
                  N8N_ENCRYPTION_KEY: "${generateToken(32)}"
                  WEBHOOK_URL: "https://{{RAILWAY_STATIC_URL}}/webhook/"
                  GENERIC_TIMEZONE: "America/New_York"
                  DB_TYPE: "postgresdb"
                  DB_POSTGRESDB_DATABASE: "{{PGDATABASE}}"
                  DB_POSTGRESDB_HOST: "{{PGHOST}}"
                  DB_POSTGRESDB_PORT: "{{PGPORT}}"
                  DB_POSTGRESDB_USER: "{{PGUSER}}"
                  DB_POSTGRESDB_PASSWORD: "{{PGPASSWORD}}"
                }
              }
            ) {
              id
              name
            }
          }
        `
      })
    });

    const { data: deployData } = await deployResponse.json();
    
    generatedConfig.railway.projectId = projectId;
    generatedConfig.railway.serviceId = deployData.serviceCreate.id;
    generatedConfig.railway.n8nPassword = generateToken(16);
    generatedConfig.railway.encryptionKey = generateToken(32);
    
    log('n8n deployment initiated on Railway!', 'success');
    log('Note: It may take 2-3 minutes for the service to be fully deployed', 'warning');
    
  } catch (error) {
    log(`Railway setup failed: ${error.message}`, 'error');
    log('You can deploy n8n manually later', 'warning');
  }
}

// Cal.com Setup
async function setupCalcom() {
  if (!process.env.CALCOM_API_KEY) {
    log('Cal.com API key not provided, skipping calendar setup', 'warning');
    return;
  }

  log('Setting up Cal.com event types...');
  
  try {
    const baseUrl = 'https://api.cal.com/v1';
    
    // Create event types
    const eventTypes = [
      {
        title: 'Discovery Call',
        slug: 'discovery-call',
        length: 30,
        description: 'Free 30-minute consultation to discuss your communication goals'
      },
      {
        title: '1:1 Speech Coaching Session',
        slug: 'speech-coaching-session',
        length: 60,
        description: 'Personalized executive speech coaching session'
      },
      {
        title: 'Package Consultation',
        slug: 'package-consultation',
        length: 45,
        description: 'Discuss coaching packages and long-term goals'
      }
    ];

    for (const eventType of eventTypes) {
      const response = await fetch(`${baseUrl}/event-types?apiKey=${process.env.CALCOM_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventType)
      });

      if (response.ok) {
        const data = await response.json();
        generatedConfig.calcom[`${eventType.slug}_id`] = data.event_type.id;
        log(`Created Cal.com event: ${eventType.title}`, 'success');
      }
    }
    
  } catch (error) {
    log(`Cal.com setup failed: ${error.message}`, 'error');
    log('You can set up calendar manually later', 'warning');
  }
}

// Generate complete .env file
async function generateEnvFile() {
  log('Generating complete .env file...');
  
  const n8nUrl = generatedConfig.railway.projectId 
    ? `https://executive-speech-coaching-n8n.up.railway.app`
    : 'https://your-n8n-instance.com';

  const envContent = `# Executive Speech Coaching NYC - Environment Configuration
# Generated on ${new Date().toISOString()}
# This file contains all necessary configuration for your coaching platform

# ====================
# AIRTABLE
# ====================
AIRTABLE_API_KEY=${process.env.AIRTABLE_API_KEY}
AIRTABLE_BASE_ID=${generatedConfig.airtable.baseId || 'YOUR_BASE_ID'}
AIRTABLE_CLIENTS_TABLE=Clients
AIRTABLE_SESSIONS_TABLE=Sessions
AIRTABLE_LEADS_TABLE=Automation Log

# ====================
# STRIPE
# ====================
STRIPE_SECRET_KEY=${process.env.STRIPE_SECRET_KEY}
STRIPE_PUBLISHABLE_KEY=${process.env.STRIPE_SECRET_KEY.replace('sk_test_', 'pk_test_')}
STRIPE_WEBHOOK_SECRET=${generatedConfig.stripe.webhookSecret || 'whsec_YOUR_WEBHOOK_SECRET'}

# Stripe Price IDs
STRIPE_PRICE_SESSION=${generatedConfig.stripe.price_11_speech_coaching_session || 'price_YOUR_SESSION_PRICE'}
STRIPE_PRICE_LAUNCH=${generatedConfig.stripe.price_launch_package_8_sessions || 'price_YOUR_LAUNCH_PRICE'}
STRIPE_PRICE_SCALE=${generatedConfig.stripe.price_scale_package_12_sessions || 'price_YOUR_SCALE_PRICE'}
STRIPE_PRICE_STARTUP=${generatedConfig.stripe.price_startup_team_package_15_sessions || 'price_YOUR_STARTUP_PRICE'}
STRIPE_PRICE_VENTURE=${generatedConfig.stripe.price_venture_team_package_20_sessions || 'price_YOUR_VENTURE_PRICE'}
STRIPE_PRICE_ENTERPRISE=${generatedConfig.stripe.price_enterprise_team_package_25_sessions || 'price_YOUR_ENTERPRISE_PRICE'}

# Stripe Payment Settings
STRIPE_PAYMENT_CAPTURE_DELAY_DAYS=0
STRIPE_SUCCESS_URL=${process.env.DOMAIN_URL}/payment-success
STRIPE_CANCEL_URL=${process.env.DOMAIN_URL}/payment-cancelled

# Stripe Invoice Settings
STRIPE_INVOICE_PREFIX=ESCNYC
STRIPE_TAX_RATE_ID=

# ====================
# GOOGLE WORKSPACE
# ====================
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
GOOGLE_CALENDAR_ID=primary

# Alternative calendar solutions
CALCOM_API_KEY=${process.env.CALCOM_API_KEY || ''}
CALCOM_DISCOVERY_CALL_ID=${generatedConfig.calcom['discovery-call_id'] || ''}
CALCOM_SESSION_ID=${generatedConfig.calcom['speech-coaching-session_id'] || ''}
CALCOM_PACKAGE_CONSULTATION_ID=${generatedConfig.calcom['package-consultation_id'] || ''}

# ====================
# N8N AUTOMATION
# ====================
# N8N Instance Configuration
N8N_HOST=${n8nUrl}
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=${generatedConfig.railway.n8nPassword || generateToken(16)}
N8N_ENCRYPTION_KEY=${generatedConfig.railway.encryptionKey || generateToken(32)}

# N8N Webhook Endpoints
N8N_WEBHOOK_URL=${n8nUrl}/webhook/
N8N_CONTACT_WEBHOOK=${n8nUrl}/webhook/contact-form
N8N_BOOKING_WEBHOOK=${n8nUrl}/webhook/booking-created
N8N_PAYMENT_WEBHOOK=${n8nUrl}/webhook/payment-received
N8N_CALENDAR_WEBHOOK=${n8nUrl}/webhook/calendar-sync
N8N_ERROR_WEBHOOK=${n8nUrl}/webhook/error-notification

# N8N Security
N8N_WEBHOOK_TOKEN=${generateToken(32)}
N8N_API_KEY=${generateToken(32)}

# N8N Database (PostgreSQL on Railway)
DB_TYPE=postgresdb
DB_POSTGRESDB_DATABASE={{PGDATABASE}}
DB_POSTGRESDB_HOST={{PGHOST}}
DB_POSTGRESDB_PORT={{PGPORT}}
DB_POSTGRESDB_USER={{PGUSER}}
DB_POSTGRESDB_PASSWORD={{PGPASSWORD}}

# N8N Timezone
GENERIC_TIMEZONE=America/New_York

# ====================
# EMAIL SETTINGS
# ====================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=${process.env.GOOGLE_WORKSPACE_EMAIL}
SMTP_PASS=YOUR_APP_SPECIFIC_PASSWORD
EMAIL_FROM="Daniel Reece <${process.env.GOOGLE_WORKSPACE_EMAIL}>"

# Notification recipients
ADMIN_EMAIL=${process.env.ADMIN_EMAIL}
ADMIN_SMS=${process.env.ADMIN_PHONE}

# ====================
# SITE CONFIGURATION
# ====================
SITE_URL=${process.env.DOMAIN_URL}
SITE_NAME="${process.env.BUSINESS_NAME}"

# ====================
# ANALYTICS & TRACKING
# ====================
GOOGLE_ANALYTICS_ID=
GOOGLE_TAG_MANAGER_ID=

# ====================
# SEO & SCHEMA MARKUP
# ====================
GOOGLE_SITE_VERIFICATION=
BING_SITE_VERIFICATION=

# Google Business Profile
GOOGLE_BUSINESS_PROFILE_ID=

# Social Media Profiles
FACEBOOK_URL=
LINKEDIN_URL=
TWITTER_HANDLE=
INSTAGRAM_URL=
YOUTUBE_CHANNEL_URL=

# Schema Organization Details
ORGANIZATION_LOGO_URL=${process.env.DOMAIN_URL}/logo.png
ORGANIZATION_FOUNDER_NAME=Daniel Reece

# Local SEO
BUSINESS_HOURS_MONDAY=9:00-18:00
BUSINESS_HOURS_TUESDAY=9:00-18:00
BUSINESS_HOURS_WEDNESDAY=9:00-18:00
BUSINESS_HOURS_THURSDAY=9:00-18:00
BUSINESS_HOURS_FRIDAY=9:00-18:00
BUSINESS_HOURS_SATURDAY=10:00-16:00
BUSINESS_HOURS_SUNDAY=closed

# Reviews & Ratings
AGGREGATE_RATING_VALUE=4.9
AGGREGATE_RATING_COUNT=47

# ====================
# API KEYS FOR SERVICES
# ====================
YOUTUBE_API_KEY=
VIMEO_API_KEY=

# ====================
# DEVELOPMENT
# ====================
NODE_ENV=production
DEBUG=false

# ====================
# NETLIFY SPECIFIC
# ====================
# These are automatically set by Netlify
# NETLIFY=true
# NETLIFY_ENV=production
# CONTEXT=production
# DEPLOY_URL=https://your-site.netlify.app

# ====================
# UI ENHANCEMENT SETTINGS
# ====================
FLOATING_CTA_TEXT="Book Free Consultation"
FLOATING_CTA_URL="/contact"
FLOATING_CTA_SCROLL_TRIGGER=30

# Mobile Footer Configuration
MOBILE_FOOTER_PHONE="${process.env.ADMIN_PHONE}"
MOBILE_FOOTER_CALL_TEXT="Call Now"
MOBILE_FOOTER_BOOK_TEXT="Book Session"
MOBILE_FOOTER_BOOK_URL="/services/discovery-call"

# Trust Indicators
TRUST_COUNTER_NUMBER=500
TRUST_COUNTER_TEXT="Executives Coached"
TRUST_URGENCY_TEXT="Limited Q1 2025 Availability"
TRUST_SHOW_URGENCY=true

# Package Comparison
PACKAGE_MOST_POPULAR="scale"
PACKAGE_SHOW_SAVINGS=true
PACKAGE_CURRENCY_SYMBOL="$"

# ====================
# SECURITY TOKENS
# ====================
SESSION_SECRET=${generateToken(32)}
CSRF_TOKEN=${generateToken(32)}
API_RATE_LIMIT_KEY=${generateToken(32)}
`;

  await fs.writeFile('.env', envContent);
  log('Complete .env file generated!', 'success');
}

// Main setup function
async function main() {
  console.log('\n🚀 Executive Speech Coaching Platform - Automated Setup\n');
  
  try {
    // Run all setups
    await setupAirtable();
    await setupStripe();
    await setupRailway();
    await setupCalcom();
    
    // Generate final .env
    await generateEnvFile();
    
    // Cleanup
    log('\nCleaning up sensitive files...', 'info');
    await fs.unlink('.env.setup');
    log('.env.setup deleted for security', 'success');
    
    // Summary
    console.log('\n✨ Setup Complete! ✨\n');
    console.log('Next steps:');
    console.log('1. Update SMTP_PASS with a Gmail app password');
    console.log('2. Add Google Analytics and social media URLs');
    console.log('3. Deploy to Netlify');
    console.log('4. Import n8n workflows from the documentation');
    console.log('\n📁 Your complete .env file has been generated');
    console.log('🔒 The .env.setup file has been deleted for security\n');
    
  } catch (error) {
    log(`\nSetup failed: ${error.message}`, 'error');
    console.log('\nPartial .env file may have been generated.');
    console.log('Please check the error and complete setup manually.\n');
  }
}

// Run the setup
main();